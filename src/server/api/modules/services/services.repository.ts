import { type Prisma } from '@prisma/client';

import { slugit } from '@/utils/strings';

import { prisma } from '@/server/db';
import { DEFAULT_PAGE_SIZE } from '@/server/utils/pagination';

import { type GetAllQueryInput } from '../../validations/base.validations';
import {
  type CreateServiceRequestInput,
  type GetAllServicesWithCategoryInput,
  type GetServiceRequestInput,
} from './services.validations';

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

export function createServiceRequest({
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

  const titleSluged = slugit(title);

  return prisma.serviceRequest.create({
    data: {
      date,
      phoneToContact,
      description,
      slug: titleSluged,
      startHour,
      title,
      customerAuthor: {
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
  profileId,
}: {
  inputs: GetServiceRequestInput;
  profileId: string;
}) => {
  return prisma.serviceRequest.findUnique({
    where: {
      id: id ?? undefined,
      slug: slug ?? undefined,
      customerAuthor: { profileId },
    },
  });
};
