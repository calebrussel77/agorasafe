/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  createTRPCRouter,
  customerProcedure,
  profileProcedure,
  providerProcedure,
  publicProcedure,
} from '@/server/api/trpc';

import {
  createServiceRequestController,
  createServiceRequestOfferController,
  createServiceRequestOfferSchema,
  createServiceRequestSchema,
  getAllServiceCategoriesController,
  getAllServiceRequestsController,
  getAllServiceRequestsSchema,
  getAllServicesController,
  getAllServicesWithCategorySchema,
  getServiceRequestController,
  getServiceRequestOffersController,
  getServiceRequestOffersSchema,
  getServiceRequestSchema,
  updateServiceRequestController,
  updateServiceRequestSchema,
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
  createServiceRequestOffer: profileProcedure
    .input(createServiceRequestOfferSchema)
    .mutation(({ input, ctx }) =>
      createServiceRequestOfferController(input, ctx?.profile?.id)
    ),
  updateServiceRequest: profileProcedure
    .input(updateServiceRequestSchema)
    .mutation(({ input }) => updateServiceRequestController(input)),

  getServiceRequest: publicProcedure
    .input(getServiceRequestSchema)
    .query(({ input, ctx }) => getServiceRequestController(input)),

  getServiceRequestOffers: publicProcedure
    .input(getServiceRequestOffersSchema)
    .query(({ input }) => getServiceRequestOffersController(input)),

  getAllServiceRequests: publicProcedure
    .input(getAllServiceRequestsSchema)
    .query(({ input }) => getAllServiceRequestsController(input)),
});
