import { type Prisma, type ServiceRequestStatus } from '@prisma/client';

import { isEmptyArray } from '@/utils/type-guards';

import { prisma } from '@/server/db';
import { getDynamicDbSlug } from '@/server/utils/db-slug';

import { type GetByIdOrSlugQueryInput } from '../../validations/base.validations';
import { simpleProfileSelect } from '../profiles';
import { ServiceRequestSelect } from './service-requests.select';
import {
  type CreateServiceRequestCommentInput,
  type CreateServiceRequestInput,
  type GetAllServiceRequestsInput,
  type GetServiceRequestInput,
  type ToggleServiceRequestReservationInput,
  type UpdateServiceRequestInput,
} from './service-requests.validations';

export const getServiceRequestReservedProviders = ({
  input,
}: {
  input: GetByIdOrSlugQueryInput &
    Pick<GetServiceRequestInput, 'providersReserved'>;
}) => {
  const { id, slug, providersReserved = 'Active' } = input;

  let ReservedProviderWhere:
    | Prisma.ServiceRequestReservationWhereInput
    | null
    | undefined = undefined;

  if (providersReserved === 'Active') {
    ReservedProviderWhere = {
      removedAt: null,
      isActive: true,
    };
  }

  if (providersReserved === 'Inactive') {
    ReservedProviderWhere = {
      isActive: false,
    };
  }

  return prisma.serviceRequest.findUnique({
    where: {
      id: id ?? undefined,
      slug: slug ?? undefined,
    },
    select: {
      id: true,
      status: true, // needed for check
      author: { select: { profile: { select: { id: true } } } }, // needed for check
      numberOfProviderNeeded: true, // needed for check
      providersReserved: {
        where: ReservedProviderWhere,
        select: {
          providerProfileId: true, // needed for check
          removedAt: true, // needed for check
          isActive: true, // needed for check
          proposal: {
            select: { content: true, price: true, id: true, createdAt: true },
          },
          provider: {
            select: {
              profile: { select: simpleProfileSelect },
              skills: true,
              profession: true,
            },
          },
        },
      },
    },
  });
};

export const getServiceRequestProposals = ({
  input,
}: {
  input: GetByIdOrSlugQueryInput;
}) => {
  const { id, slug } = input;

  return prisma.serviceRequest.findUnique({
    where: {
      id: id ?? undefined,
      slug: slug ?? undefined,
    },
    select: {
      id: true,
      proposals: {
        select: {
          author: { select: { profile: { select: simpleProfileSelect } } },
        },
      },
    },
  });
};

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
  providersReserved = 'Active',
  orderBy = 'desc',
  status: _status = 'OPEN',
  showReservedProviders,
  authorId,
}: GetAllServiceRequestsInput) => {
  const skip = page ? (page - 1) * limit : undefined;
  let status: ServiceRequestStatus | undefined;

  let OR: Prisma.ServiceRequestWhereInput[] | undefined = undefined;
  let selectCount:
    | Prisma.ServiceRequestCountOutputTypeSelect
    | null
    | undefined = {
    comments: true,
    reviews: true,
    proposals: { where: { isArchived: false } },
    photos: true,
  };

  if (_status === 'ALL') {
    status = undefined;
  } else status = _status;

  if (providersReserved === 'Active') {
    selectCount = {
      ...selectCount,
      providersReserved: { where: { removedAt: null, isActive: true } },
    };
  }

  if (providersReserved === 'Inactive') {
    selectCount = {
      ...selectCount,
      providersReserved: { where: { isActive: false } },
    };
  }

  if (query) {
    OR = [{ title: { contains: query } }, { description: { contains: query } }];
    status = undefined;
  }

  return prisma.$transaction([
    prisma.serviceRequest.count({
      where: { status },
    }),
    prisma.serviceRequest.findMany({
      where: {
        status,
        OR,
        author: authorId ? { profileId: authorId } : undefined,
      },
      orderBy: { createdAt: orderBy },
      select: {
        id: true,
        slug: true,
        createdAt: true,
        date: true,
        title: true,
        description: true,
        location: {
          select: { lat: true, long: true, address: true, placeId: true },
        },
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
        //TODO: Need to split this function on two functions
        providersReserved: {
          where: { removedAt: null },
          select: {
            provider: {
              select: { profile: { select: simpleProfileSelect } },
            },
            isActive: true,
          },
        },
        _count: {
          select: {
            ...selectCount,
          },
        },
      },
      skip,
      take: limit,
    }),
  ]);
};

export async function createServiceRequest({
  input,
  profileId,
}: {
  input: CreateServiceRequestInput;
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
  } = input;

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
          where: { placeId: location.placeId },
          create: {
            lat: location.lat,
            long: location.long,
            address: location.address,
            placeId: location.placeId,
            country: location.country,
            city: location.city,
          },
        },
      },
    },
  });
}

export function createServiceRequestComment({
  input,
  profileId,
}: {
  input: CreateServiceRequestCommentInput;
  profileId: string;
}) {
  const { serviceRequestSlug, text } = input;

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
  input,
}: {
  input: UpdateServiceRequestInput;
}) => {
  const { serviceRequestSlug, location, photos, serviceRequestId, ...rest } =
    input;

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
        where: { placeId: location.placeId },
        create: {
          lat: location.lat as never,
          long: location.long as never,
          address: location.address as never,
          placeId: location.placeId as never,
          country: location.country,
          city: location.city,
        },
      },
    };
  }

  return prisma.serviceRequest.update({
    where: { slug: serviceRequestSlug ?? undefined, id: serviceRequestId },
    data: {
      ...rest,
      photos: _photos,
      location: _location,
    },
  });
};

export const getServiceRequestStats = ({
  input: { id, slug, providersReserved = 'Active' },
}: {
  input: GetServiceRequestInput;
}) => {
  let selectCount:
    | Prisma.ServiceRequestCountOutputTypeSelect
    | null
    | undefined = {
    comments: true,
    reviews: true,
    proposals: { where: { isArchived: false } },
    photos: true,
  };

  if (providersReserved === 'Active') {
    selectCount = {
      ...selectCount,
      providersReserved: { where: { removedAt: null, isActive: true } },
    };
  }

  if (providersReserved === 'Inactive') {
    selectCount = {
      ...selectCount,
      providersReserved: { where: { isActive: false } },
    };
  }

  return prisma.serviceRequest.findUnique({
    where: {
      id: id ?? undefined,
      slug: slug ?? undefined,
    },
    select: { id: true, _count: { select: selectCount } },
  });
};

export const getServiceRequestWithDetails = ({
  input: { id, slug },
}: {
  input: GetServiceRequestInput;
}) => {
  return prisma.serviceRequest.findUnique({
    where: {
      id: id ?? undefined,
      slug: slug ?? undefined,
    },
    select: { ...ServiceRequestSelect },
  });
};

export function createServiceRequestReservation({
  input,
  authorProfileId,
}: {
  input: ToggleServiceRequestReservationInput;
} & { authorProfileId: string }) {
  const { providerProfileId, serviceRequestId, proposalId } = input;

  return prisma.serviceRequest.update({
    where: { id: serviceRequestId },
    data: {
      providersReserved: {
        create: {
          proposal: proposalId ? { connect: { id: proposalId } } : undefined,
          provider: {
            connectOrCreate: {
              where: { profileId: providerProfileId },
              create: { profile: { connect: { id: providerProfileId } } },
            },
          },
          customer: {
            connectOrCreate: {
              where: { profileId: authorProfileId },
              create: { profile: { connect: { id: authorProfileId } } },
            },
          },
        },
      },
    },
  });
}

export function updateServiceRequestReservation({
  input,
  data,
}: {
  input: ToggleServiceRequestReservationInput & { authorProfileId: string };
  data: Prisma.ServiceRequestReservationUpdateWithoutServiceRequestInput;
}) {
  const { authorProfileId, providerProfileId, serviceRequestId, proposalId } =
    input;

  return prisma.serviceRequest.update({
    where: { id: serviceRequestId },
    data: {
      providersReserved: {
        update: {
          where: {
            providerProfileId_serviceRequestId_customerProfileId: {
              providerProfileId,
              serviceRequestId,
              customerProfileId: authorProfileId,
            },
          },
          data,
        },
      },
    },
  });
}

//TODO : in the future, we should archived service request
export const deleteServiceRequest = ({ id }: { id: string }) => {
  return prisma.serviceRequest.delete({
    where: { id },
  });
};
