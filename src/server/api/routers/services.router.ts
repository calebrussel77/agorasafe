/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  createTRPCRouter,
  customerProcedure,
  profileProcedure,
  publicProcedure,
} from '@/server/api/trpc';

import {
  createServiceRequestController,
  createServiceRequestSchema,
  getAllServiceCategoriesController,
  getAllServicesController,
  getAllServicesWithCategorySchema,
  getServiceRequestController,
  getServiceRequestOffersController,
  getServiceRequestOffersSchema,
  getServiceRequestSchema,
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
    .mutation(({ input, ctx }) =>
      createServiceRequestController(input, ctx?.profile?.id)
    ),

  getServiceRequest: publicProcedure
    .input(getServiceRequestSchema)
    .query(({ input, ctx }) => getServiceRequestController(input)),

  getServiceRequestOffers: publicProcedure
    .input(getServiceRequestOffersSchema)
    .query(({ input }) => getServiceRequestOffersController(input)),
});
