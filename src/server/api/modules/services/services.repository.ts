import { type Prisma } from '@prisma/client';

import { isEmptyArray } from '@/utils/type-guards';

import { prisma } from '@/server/db';
import { getDynamicDbSlug } from '@/server/utils/db-slug';
import { DEFAULT_PAGE_SIZE } from '@/server/utils/pagination';

import {
  type GetAllQueryInput,
  type GetByIdOrSlugQueryInput,
} from '../../validations/base.validations';
import { simpleProfileSelect } from '../profiles';
import type {
  CreateServiceRequestCommentInput,
  CreateServiceRequestInput,
  GetAllServicesWithCategoryInput,
  GetServiceRequestCommentsInput,
  GetServiceRequestInput,
  ToggleServiceRequestReservationInput,
  UpdateServiceRequestInput,
} from './services.validations';
import { type GetAllServiceRequestsInput } from './services.validations';

const _getServiceRequestBySlug = (slug: string) => {
  return prisma.serviceRequest.findUnique({
    where: { slug },
    select: { slug: true },
  });
};

export const getAllServiceRequests = ({
  limit,
  page,
  query,
  providersReserved = 'All',
  orderBy = 'desc',
  status = 'OPEN',
}: GetAllServiceRequestsInput) => {
  const skip = page ? (page - 1) * limit : undefined;

  let OR: Prisma.ServiceRequestWhereInput[] | undefined = undefined;
  let selectCount:
    | Prisma.ServiceRequestCountOutputTypeSelect
    | null
    | undefined = { providersReserved: true };

  if (query)
    OR = [{ title: { contains: query } }, { description: { contains: query } }];

  if (providersReserved === 'Active') {
    selectCount = {
      providersReserved: { where: { removedAt: null, isActive: true } },
    };
  }

  if (providersReserved === 'Inactive') {
    selectCount = {
      providersReserved: { where: { isActive: false } },
    };
  }

  return prisma.$transaction([
    prisma.serviceRequest.count({
      where: { status },
    }),
    prisma.serviceRequest.findMany({
      where: { status, OR },
      orderBy: { createdAt: orderBy },
      select: {
        id: true,
        slug: true,
        createdAt: true,
        date: true,
        title: true,
        description: true,
        location: { select: { lat: true, long: true, name: true } },
        nbOfHours: true,
        estimatedPrice: true,
        numberOfProviderNeeded: true,
        willWantProposal: true,
        author: { select: { profile: { select: simpleProfileSelect } } },
        status: true,
        service: {
          select: { categoryService: { select: { name: true, slug: true } } },
        },
        photos: { select: { name: true, url: true } },
        comments: {
          select: {
            author: {
              select: { name: true, avatar: true, slug: true },
            },
          },
        },
        _count: { select: { ...selectCount, comments: true } },
      },
      skip,
      take: limit,
    }),
  ]);
};

export function getAllServicesWithCategory({
  query,
  limit = DEFAULT_PAGE_SIZE,
  page,
  categoryServiceSlug,
  categoryServiceId,
}: GetAllServicesWithCategoryInput) {
  let OR: Prisma.Enumerable<Prisma.ServiceWhereInput> | undefined = undefined;

  const skip = page ? (page - 1) * limit : undefined;
  categoryServiceId = categoryServiceId ? categoryServiceId : undefined;
  const categoryService = categoryServiceSlug
    ? { slug: categoryServiceSlug }
    : undefined;

  if (query)
    OR = [{ name: { contains: query } }, { description: { contains: query } }];

  return prisma.service.findMany({
    take: limit,
    skip,
    where: {
      categoryServiceId,
      categoryService,
      OR,
    },
    select: {
      _count: true,
      id: true,
      slug: true,
      name: true,
      categoryService: { select: { id: true, name: true, slug: true } },
    },
  });
}

export function getAllCategoryServices({
  query,
  limit = DEFAULT_PAGE_SIZE,
  page,
}: GetAllQueryInput) {
  const skip = page ? (page - 1) * limit : undefined;

  let OR: Prisma.Enumerable<Prisma.CategoryServiceWhereInput> | undefined =
    undefined;

  if (query)
    OR = [{ name: { contains: query } }, { description: { contains: query } }];

  return prisma.categoryService.findMany({
    where: {
      OR,
    },
    skip,
    take: limit,
    select: {
      _count: true,
      id: true,
      slug: true,
      name: true,
    },
  });
}

export async function createServiceRequest({
  inputs,
  profileId,
}: {
  inputs: CreateServiceRequestInput;
  profileId: string;
}) {
  const {
    date,
    description,
    nbOfHours,
    phoneToContact,
    startHour,
    title,
    estimatedPrice,
    numberOfProviderNeeded,
    photos,
    willWantProposal,
    location,
    serviceSlug,
    categorySlug,
  } = inputs;

  const titleSluged = await getDynamicDbSlug(title, _getServiceRequestBySlug);

  return prisma.serviceRequest.create({
    data: {
      date,
      phoneToContact,
      description,
      slug: titleSluged,
      startHour,
      title,
      author: {
        connectOrCreate: {
          where: { profileId },
          create: { profile: { connect: { id: profileId } } },
        },
      },
      estimatedPrice,
      numberOfProviderNeeded,
      nbOfHours,
      willWantProposal,
      service: {
        connectOrCreate: {
          where: { slug: serviceSlug || 'fake-slug' },
          create: {
            name: title,
            slug: titleSluged,
            categoryService: { connect: { slug: categorySlug } },
          },
        },
      },
      photos: {
        createMany: {
          data: photos || [],
        },
      },
      location: {
        connectOrCreate: {
          where: { name: location.value },
          create: {
            lat: location.lat,
            long: location.long,
            name: location.value,
          },
        },
      },
    },
  });
}

export function createServiceRequestComment({
  inputs,
  profileId,
}: {
  inputs: CreateServiceRequestCommentInput;
  profileId: string;
}) {
  const { serviceRequestSlug, text } = inputs;

  return prisma.comment.create({
    data: {
      text,
      author: {
        connect: {
          id: profileId,
        },
      },
      serviceRequest: { connect: { slug: serviceRequestSlug } },
    },
  });
}

export const updateServiceRequest = ({
  inputs,
}: {
  inputs: UpdateServiceRequestInput;
}) => {
  const { serviceRequestSlug, location, photos, ...rest } = inputs;

  let _photos:
    | Prisma.FileUpdateManyWithoutServiceRequestNestedInput
    | undefined = undefined;

  let _location:
    | Prisma.LocationUpdateOneRequiredWithoutServiceRequestNestedInput
    | undefined = undefined;

  if (photos && !isEmptyArray(photos)) {
    for (const photo of photos) {
      _photos = {
        connectOrCreate: {
          where: { key: photo?.key as string },
          create: { name: photo.name as string, url: photo.url as string },
        },
      };
    }
  }

  if (location) {
    _location = {
      connectOrCreate: {
        where: { name: location.value },
        create: {
          lat: location.lat as string,
          long: location.long as string,
          name: location.value as string,
        },
      },
    };
  }

  return prisma.serviceRequest.update({
    where: { slug: serviceRequestSlug },
    data: {
      ...rest,
      photos: _photos,
      location: _location,
    },
  });
};

export const getServiceRequestWithDetails = ({
  inputs: { id, slug, providersReserved = 'All' },
}: {
  inputs: GetServiceRequestInput;
}) => {
  let selectCount:
    | Prisma.ServiceRequestCountOutputTypeSelect
    | null
    | undefined = { providersReserved: true };

  let providersReservedWhere:
    | Prisma.ServiceRequestReservationWhereInput
    | undefined = undefined;

  if (providersReserved === 'Active') {
    providersReservedWhere = {
      isActive: true,
      removedAt: null,
    };
    selectCount = {
      providersReserved: { where: { removedAt: null, isActive: true } },
    };
  }

  if (providersReserved === 'Inactive') {
    providersReservedWhere = {
      isActive: false,
    };
    selectCount = {
      providersReserved: { where: { isActive: false } },
    };
  }

  return prisma.serviceRequest.findUnique({
    where: {
      id: id ?? undefined,
      slug: slug ?? undefined,
    },
    include: {
      location: true,
      providersReserved: {
        where: providersReservedWhere,
        select: {
          isActive: true,
          removedAt: true,
          provider: {
            select: {
              profile: { select: simpleProfileSelect },
              profession: true,
            },
          },
          providerProfileId: true,
          customerProfileId: true,
        },
      },
      author: { select: { profile: { select: simpleProfileSelect } } },
      photos: true,
      _count: { select: selectCount },
    },
  });
};

export function getServiceRequestComments({
  inputs: {
    query,
    page,
    limit = DEFAULT_PAGE_SIZE,
    serviceRequestId,
    serviceRequestSlug,
  },
}: {
  inputs: GetServiceRequestCommentsInput;
}) {
  const skip = page ? (page - 1) * limit : undefined;

  return prisma.comment.findMany({
    // orderBy: { createdAt: 'desc' },
    where: {
      serviceRequestId,
      serviceRequest: serviceRequestSlug
        ? { slug: serviceRequestSlug }
        : undefined,
    },
    skip,
    take: limit,
    select: {
      id: true,
      text: true,
      createdAt: true,
      author: { select: simpleProfileSelect },
    },
  });
}

export const getServiceRequestWithReservedProviders = ({
  inputs,
}: {
  inputs: GetByIdOrSlugQueryInput;
}) => {
  const { id, slug } = inputs;

  return prisma.serviceRequest.findUnique({
    where: {
      id: id ?? undefined,
      slug: slug ?? undefined,
    },
    select: {
      slug: true,
      status: true,
      providersReserved: true,
      numberOfProviderNeeded: true,
    },
  });
};

export function createServiceRequestReservation({
  inputs,
}: {
  inputs: ToggleServiceRequestReservationInput;
}) {
  const { customerProfileId, providerProfileId, serviceRequestId } = inputs;

  console.log({ inputs });

  return prisma.serviceRequest.update({
    where: { id: serviceRequestId },
    data: {
      providersReserved: {
        create: {
          provider: {
            connectOrCreate: {
              where: { profileId: providerProfileId },
              create: { profile: { connect: { id: providerProfileId } } },
            },
          },
          customer: {
            connectOrCreate: {
              where: { profileId: customerProfileId },
              create: { profile: { connect: { id: customerProfileId } } },
            },
          },
        },
      },
    },
  });
}

export function updateServiceRequestReservation({
  inputs,
  data,
}: {
  inputs: ToggleServiceRequestReservationInput;
  data: Prisma.ServiceRequestReservationUpdateWithoutServiceRequestInput;
}) {
  const { customerProfileId, providerProfileId, serviceRequestId } = inputs;

  return prisma.serviceRequest.update({
    where: { id: serviceRequestId },
    data: {
      providersReserved: {
        update: {
          where: {
            providerProfileId_serviceRequestId_customerProfileId: {
              providerProfileId,
              serviceRequestId,
              customerProfileId,
            },
          },
          data,
        },
      },
    },
  });
}

export function toggleServiceRequestReservation({
  inputs,
  isProviderReservedAndActive,
}: {
  inputs: ToggleServiceRequestReservationInput;
  isProviderReservedAndActive?: boolean;
}) {
  const { customerProfileId, providerProfileId, serviceRequestId } = inputs;
  let update = {
    removedAt: null,
    isActive: true,
  } as { isActive: boolean; removedAt: Date | null };

  if (isProviderReservedAndActive) {
    update = {
      removedAt: new Date(),
      isActive: false,
    };
  }

  return prisma.serviceRequest.update({
    where: { id: serviceRequestId },
    data: {
      providersReserved: {
        upsert: {
          where: {
            providerProfileId_serviceRequestId_customerProfileId: {
              customerProfileId,
              providerProfileId,
              serviceRequestId,
            },
          },
          create: {
            customerProfileId,
            providerProfileId,
            removedAt: null,
            isActive: true,
          },
          update,
        },
      },
    },
  });
}
