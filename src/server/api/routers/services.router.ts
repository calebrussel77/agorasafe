import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

import {
  getAllServiceCategoriesController,
  getAllServicesController,
  getAllServicesWithCategorySchema,
} from '../modules/services';
import { getAllQuerySchema } from '../validations/base.validations';

export const servicesRouter = createTRPCRouter({
  getAllservices: publicProcedure
    .input(getAllServicesWithCategorySchema)
    .query(({ input }) => getAllServicesController(input)),
  getAllServiceCategories: publicProcedure
    .input(getAllQuerySchema)
    .query(({ input }) => getAllServiceCategoriesController(input)),
});
