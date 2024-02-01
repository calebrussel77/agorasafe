import { dateSchema, locationSchema, phoneSchema } from '@/validations';
import { ServiceRequestStatus } from '@prisma/client';
import { z } from 'zod';

import {
  getAllQuerySchema,
  nonEmptyHtmlString,
} from '../../validations/base.validations';

export const getAllServiceRequestsSchema = getAllQuerySchema.extend({
  providersReserved: z.enum(['Active', 'Inactive', 'All']).optional(),
  showReservedProviders: z.boolean().optional(),
  status: z
    .enum([ServiceRequestStatus.OPEN, ServiceRequestStatus.CLOSED, 'ALL'])
    .optional(),
  orderBy: z.enum(['desc', 'asc']).optional(),
  authorId: z.string().trim().optional(),
});

export const getServiceRequestSchema = z
  .object({
    providersReserved: z.enum(['Active', 'Inactive', 'All']).optional(),
  })
  .extend({
    id: z.string().trim(),
    slug: z.string().trim(),
  })
  .partial()
  .refine(data => data.id || data.slug, "L'id ou le slug est requis");

export const createServiceRequestCommentSchema = z.object({
  text: z.string().trim(),
  serviceRequestSlug: z.string(),
});

export const createServiceRequestSchema = z.object({
  title: z.string().trim(),
  description: z.string().trim(),
  phoneToContact: phoneSchema,
  location: locationSchema,
  photos: z
    .array(z.object({ key: z.string(), url: z.string(), name: z.string() }))
    .max(3, { message: 'Vous ne pouvez uploader que 03 photos' })
    .optional(),
  numberOfProviderNeeded: z.number().optional(),
  willWantProposal: z.boolean().optional(),
  nbOfHours: z.number(),
  date: dateSchema,
  startHour: z.number(),
  estimatedPrice: z.number().optional(),
  serviceSlug: z.string().optional(),
  categorySlug: z.string(),
});

export type CreateServiceRequestProposalInput = z.infer<
  typeof createServiceRequestProposalSchema
>;
export const createServiceRequestProposalSchema = z.object({
  serviceRequestId: z.string(),
  content: nonEmptyHtmlString,
  price: z.number().optional(),
});

export const toggleServiceRequestReservationSchema = z.object({
  serviceRequestId: z.string(),
  providerProfileId: z.string(),
  proposalId: z.string().optional(),
});

export const updateServiceRequestSchema = createServiceRequestSchema
  .omit({ categorySlug: true, serviceSlug: true })
  .deepPartial()
  .extend({
    serviceRequestSlug: z.string().optional(),
    serviceRequestId: z.string(),
    status: z.nativeEnum(ServiceRequestStatus).optional(),
  });

export type CreateServiceRequestInput = z.infer<
  typeof createServiceRequestSchema
>;

export type CreateServiceRequestCommentInput = z.infer<
  typeof createServiceRequestCommentSchema
>;

export type UpdateServiceRequestInput = z.infer<
  typeof updateServiceRequestSchema
>;

export type GetServiceRequestInput = z.infer<typeof getServiceRequestSchema>;

export type GetAllServiceRequestsInput = z.infer<
  typeof getAllServiceRequestsSchema
>;

export type ToggleServiceRequestReservationInput = z.infer<
  typeof toggleServiceRequestReservationSchema
>;

export type UpdateServiceRequestProposalInput = z.infer<
  typeof updateServiceRequestProposalSchema
>;
export const updateServiceRequestProposalSchema =
  createServiceRequestProposalSchema.deepPartial().extend({
    id: z.string(),
  });
