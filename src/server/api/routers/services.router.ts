import {
  createTRPCRouter,
  customerProcedure,
  publicProcedure,
} from '@/server/api/trpc';

import {
  createServiceRequestController,
  createServiceRequestSchema,
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

  publishServiceRequest: customerProcedure
    .input(createServiceRequestSchema)
    .query(({ input, ctx }) => createServiceRequestController(input, 'sss')),
});
