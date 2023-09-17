import { dateSchema, locationSchema, phoneSchema } from '@/validations';
import { z } from 'zod';

import { getAllQuerySchema } from '../../validations/base.validations';

export const getAllServicesWithCategorySchema = getAllQuerySchema.extend({
  categoryServiceSlug: z.string().trim().optional(),
  categoryServiceId: z.string().trim().optional(),
});

export const getServiceRequestSchema = z
  .object({
    id: z.string().trim(),
    slug: z.string().trim(),
  })
  .partial()
  .refine(data => data.id || data.slug, "L'id ou le slug est requis");

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

export const getServiceRequestOffersSchema = getAllQuerySchema
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

export type GetAllServicesWithCategoryInput = z.infer<
  typeof getAllServicesWithCategorySchema
>;

export type GetServiceRequestInput = z.infer<typeof getServiceRequestSchema>;

export type GetServiceRequestOffersInput = z.infer<
  typeof getServiceRequestOffersSchema
>;
