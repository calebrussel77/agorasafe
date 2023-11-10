/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  createTRPCRouter,
  customerProcedure,
  profileProcedure,
  publicProcedure,
} from '@/server/api/trpc';

import {
  createServiceRequestCommentController,
  createServiceRequestCommentSchema,
  createServiceRequestController,
  createServiceRequestSchema,
  getAllServiceCategoriesController,
  getAllServiceRequestsController,
  getAllServiceRequestsSchema,
  getAllServicesController,
  getAllServicesWithCategorySchema,
  getServiceRequestCommentsController,
  getServiceRequestCommentsSchema,
  getServiceRequestController,
  getServiceRequestSchema,
  toggleServiceRequestReservationController,
  toggleServiceRequestReservationSchema,
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
  createServiceRequestComment: profileProcedure
    .input(createServiceRequestCommentSchema)
    .mutation(({ input, ctx }) =>
      createServiceRequestCommentController(input, ctx?.profile?.id)
    ),
  updateServiceRequest: profileProcedure
    .input(updateServiceRequestSchema)
    .mutation(({ input }) => updateServiceRequestController(input)),

  toggleServiceRequestReservation: customerProcedure
    .input(toggleServiceRequestReservationSchema)
    .mutation(({ input }) => toggleServiceRequestReservationController(input)),

  getServiceRequest: publicProcedure
    .input(getServiceRequestSchema)
    .query(({ input }) => getServiceRequestController(input)),

  getServiceRequestComments: publicProcedure
    .input(getServiceRequestCommentsSchema)
    .query(({ input }) => getServiceRequestCommentsController(input)),

  getAllServiceRequests: publicProcedure
    .input(getAllServiceRequestsSchema)
    .query(({ input }) => getAllServiceRequestsController(input)),
});
