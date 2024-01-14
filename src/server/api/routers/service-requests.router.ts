import { z } from 'zod';

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
  deleteServiceRequestHandler,
  deleteServiceRequestProposalHandler,
  getAllServiceRequestsHandler,
  getAllServiceRequestsSchema,
  getServiceRequestHandler,
  getServiceRequestProposalsHandler,
  getServiceRequestReservedProvidersHandler,
  getServiceRequestSchema,
  getServiceRequestStatsHandler,
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
    .input(getByIdQuerySchema.extend({ isArchived: z.boolean().optional() }))
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

  delete: profileProcedure
    .input(getByIdQuerySchema)
    .mutation(deleteServiceRequestHandler),

  getReservedProviders: publicProcedure
    .input(getByIdQuerySchema.and(getServiceRequestSchema))
    .query(getServiceRequestReservedProvidersHandler),

  toggleReservation: customerProcedure
    .input(toggleServiceRequestReservationSchema)
    .mutation(toggleServiceRequestReservationHandler),

  get: publicProcedure
    .input(getServiceRequestSchema)
    .query(getServiceRequestHandler),

  getStats: publicProcedure
    .input(getServiceRequestSchema)
    .query(getServiceRequestStatsHandler),

  getAll: publicProcedure
    .input(getAllServiceRequestsSchema)
    .query(getAllServiceRequestsHandler),
});
