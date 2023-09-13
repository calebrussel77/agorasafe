import { locationSchema, phoneSchema } from '@/validations';
import { z } from 'zod';

import { getAllQuerySchema } from '../../validations/base.validations';

export const getAllServicesWithCategorySchema = getAllQuerySchema.extend({
  categoryServiceSlug: z.string().trim().optional(),
  categoryServiceId: z.string().trim().optional(),
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
  date: z.date(),
  startHour: z.number(),
  estimatedPrice: z.number().optional(),
  serviceId: z.string(),
});

export type CreateServiceRequestInput = z.infer<
  typeof createServiceRequestSchema
>;

export type GetAllServicesWithCategoryInput = z.infer<
  typeof getAllServicesWithCategorySchema
>;
