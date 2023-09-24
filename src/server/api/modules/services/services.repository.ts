import { type Prisma } from '@prisma/client';

import { isEmptyArray } from '@/utils/type-guards';

import { prisma } from '@/server/db';
import { getDynamicDbSlug } from '@/server/utils/db-slug';
import { DEFAULT_PAGE_SIZE } from '@/server/utils/pagination';

import { type GetAllQueryInput } from '../../validations/base.validations';
import { simpleProfileSelect } from '../profiles';
import type {
  CreateServiceRequestInput,
  GetAllServicesWithCategoryInput,
  GetServiceRequestInput,
  GetServiceRequestOffersInput,
  UpdateServiceRequestInput,
} from './services.validations';

const getServiceRequestBySlug = (slug: string) => {
  return prisma.serviceRequest.findUnique({
    where: { slug },
    select: { slug: true },
  });
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

  const titleSluged = await getDynamicDbSlug(title, getServiceRequestBySlug);

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
  inputs: { id, slug },
}: {
  inputs: GetServiceRequestInput;
}) => {
  return prisma.serviceRequest.findUnique({
    where: {
      id: id ?? undefined,
      slug: slug ?? undefined,
    },
    include: {
      location: true,
      choosedProviders: {
        select: { provider: { select: { profile: { select: { id: true } } } } },
      },
      author: { select: { profile: { select: simpleProfileSelect } } },
      photos: true,
    },
  });
};

export function getServiceRequestOffers({
  inputs: {
    query,
    page,
    limit = DEFAULT_PAGE_SIZE,
    serviceRequestId,
    serviceRequestSlug,
  },
}: {
  inputs: GetServiceRequestOffersInput;
}) {
  const skip = page ? (page - 1) * limit : undefined;

  return prisma.serviceRequestOffer.findMany({
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
      proposedPrice: true,
      author: { include: { profile: { select: simpleProfileSelect } } },
    },
  });
}
