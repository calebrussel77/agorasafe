import {
  createTRPCRouter,
  customerProcedure,
  profileProcedure,
  publicProcedure,
} from '@/server/api/trpc';

import {
  createServiceRequestCommentHandler,
  createServiceRequestCommentSchema,
  createServiceRequestHandler,
  createServiceRequestProposalHandler,
  createServiceRequestProposalSchema,
  createServiceRequestSchema,
  deleteServiceRequestProposalHandler,
  getAllServiceRequestsHandler,
  getAllServiceRequestsSchema,
  getServiceRequestHandler,
  getServiceRequestProposalsHandler,
  getServiceRequestReservedProvidersHandler,
  getServiceRequestSchema,
  toggleServiceRequestReservationHandler,
  toggleServiceRequestReservationSchema,
  updateServiceRequestHandler,
  updateServiceRequestProposalHandler,
  updateServiceRequestProposalSchema,
  updateServiceRequestSchema,
} from '../modules/service-requests';
import {
  getByIdOrSlugQuerySchema,
  getByIdQuerySchema,
} from '../validations/base.validations';

export const serviceRequestsRouter = createTRPCRouter({
  create: customerProcedure
    .input(createServiceRequestSchema)
    .mutation(createServiceRequestHandler),

  createComment: profileProcedure
    .input(createServiceRequestCommentSchema)
    .mutation(createServiceRequestCommentHandler),

  getProposals: publicProcedure
    .input(getByIdOrSlugQuerySchema)
    .query(getServiceRequestProposalsHandler),

  createProposal: profileProcedure
    .input(createServiceRequestProposalSchema)
    .mutation(createServiceRequestProposalHandler),

  updateProposal: profileProcedure
    .input(updateServiceRequestProposalSchema)
    .mutation(updateServiceRequestProposalHandler),

  deleteProposal: profileProcedure
    .input(getByIdQuerySchema)
    .mutation(deleteServiceRequestProposalHandler),

  update: profileProcedure
    .input(updateServiceRequestSchema)
    .mutation(updateServiceRequestHandler),

  getReservedProviders: publicProcedure
    .input(getByIdOrSlugQuerySchema)
    .query(getServiceRequestReservedProvidersHandler),

  toggleReservation: customerProcedure
    .input(toggleServiceRequestReservationSchema)
    .mutation(toggleServiceRequestReservationHandler),

  get: publicProcedure
    .input(getServiceRequestSchema)
    .query(getServiceRequestHandler),

  getAll: publicProcedure
    .input(getAllServiceRequestsSchema)
    .query(getAllServiceRequestsHandler),
});
