import { dateSchema, locationSchema, phoneSchema } from '@/validations';
import { ServiceRequestStatus } from '@prisma/client';
import { z } from 'zod';

import { getAllQuerySchema } from '../../validations/base.validations';

export const getAllServicesWithCategorySchema = getAllQuerySchema.extend({
  categoryServiceSlug: z.string().trim().optional(),
  categoryServiceId: z.string().trim().optional(),
});

export const getAllServiceRequestsSchema = getAllQuerySchema.extend({
  status: z.nativeEnum(ServiceRequestStatus).optional(),
  orderBy: z.enum(['desc', 'asc']).optional(),
});

export const getServiceRequestSchema = z
  .object({
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

export const updateServiceRequestSchema = createServiceRequestSchema
  .omit({ categorySlug: true, serviceSlug: true })
  .deepPartial()
  .extend({
    serviceRequestSlug: z.string(),
    status: z.nativeEnum(ServiceRequestStatus).optional(),
  });

export const getServiceRequestCommentsSchema = getAllQuerySchema
  .extend({
    serviceRequestId: z.string().trim(),
    serviceRequestSlug: z.string().trim(),
  })
  .partial()
  .refine(
    data => data.serviceRequestId || data.serviceRequestSlug,
    "L'id ou le slug est requis"
  );

export type CreateServiceRequestInput = z.infer<
  typeof createServiceRequestSchema
>;

export type CreateServiceRequestCommentInput = z.infer<
  typeof createServiceRequestCommentSchema
>;

export type UpdateServiceRequestInput = z.infer<
  typeof updateServiceRequestSchema
>;

export type GetAllServicesWithCategoryInput = z.infer<
  typeof getAllServicesWithCategorySchema
>;

export type GetServiceRequestInput = z.infer<typeof getServiceRequestSchema>;

export type GetServiceRequestCommentsInput = z.infer<
  typeof getServiceRequestCommentsSchema
>;

export type GetAllServiceRequestsInput = z.infer<
  typeof getAllServiceRequestsSchema
>;
