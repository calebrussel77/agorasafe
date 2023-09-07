import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import {
  getAllServiceCategoriesController,
  getAllServicesController,
  getAllServicesWithCategorySchema,
} from '../modules/services';
import { getAllQuerySchema } from '../validations/base.validations';

export const servicesRouter = createTRPCRouter({
  getAllservices: protectedProcedure
    .input(getAllServicesWithCategorySchema)
    .query(({ input }) => getAllServicesController(input)),
  getAllServiceCategories: protectedProcedure
    .input(getAllQuerySchema)
    .query(({ input }) => getAllServiceCategoriesController(input)),
});
