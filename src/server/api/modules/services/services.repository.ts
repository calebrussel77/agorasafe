import { prisma } from '@/server/db';
import { DEFAULT_PAGE_SIZE } from '@/server/utils/pagination';

import { type GetAllQueryInput } from '../../validations/base.validations';
import { type GetAllServicesWithCategoryInput } from './services.validations';

export function getAllServicesWithCategory({
  query,
  limit = DEFAULT_PAGE_SIZE,
  page,
  categoryServiceSlug,
  categoryServiceId,
}: GetAllServicesWithCategoryInput) {
  return prisma.service.findMany({
    where: {
      categoryServiceId,
      categoryService: categoryServiceSlug
        ? {
            slug: categoryServiceSlug,
          }
        : undefined,

      OR: query ? [{ name: query }, { description: query }] : undefined,
    },
    skip: page,
    take: limit,
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
  return prisma.categoryService.findMany({
    where: {
      OR: query ? [{ name: query }, { description: query }] : undefined,
    },
    skip: page,
    take: limit,
    select: {
      _count: true,
      id: true,
      slug: true,
      name: true,
    },
  });
}
