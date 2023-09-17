import { type Prisma } from '@prisma/client';

import { makeRandomId } from '@/utils/misc';
import { slugit } from '@/utils/strings';

import { prisma } from '@/server/db';
import { getDynamicDbSlug } from '@/server/utils/db-slug';
import { throwDbError } from '@/server/utils/error-handling';
import { DEFAULT_PAGE_SIZE } from '@/server/utils/pagination';

import { type GetAllQueryInput } from '../../validations/base.validations';
import { simpleProfileSelect } from '../profiles';
import type {
  CreateServiceRequestInput,
  GetAllServicesWithCategoryInput,
  GetServiceRequestInput,
  GetServiceRequestOffersInput,
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
    OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ];

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
    OR = [
      { name: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
    ];

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
          where: { slug: serviceSlug },
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
      proposedPrice: true,
      author: { include: { profile: { select: simpleProfileSelect } } },
    },
  });
}
