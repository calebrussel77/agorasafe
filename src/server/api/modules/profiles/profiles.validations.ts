import { ProfileType } from '@prisma/client';
import { z } from 'zod';

import { getAllQuerySchema } from '../../validations/base.validations';

export const getProfilesByUserIdValidationSchema = z.object({
  userId: z.string().trim(),
  name: z.string().trim(),
});

export type GetProfilesByUserIdValidation = z.infer<
  typeof getProfilesByUserIdValidationSchema
>;

export type GetProfileServiceRequestReservationsInput = z.infer<
  typeof getProfileServiceRequestReservationsSchema
>;
export const getProfileServiceRequestReservationsSchema = z.object({
  isActive: z.boolean().optional(),
  customerProfileId: z.string().optional(),
  providerProfileId: z.string().optional(),
});

export type GetProfilesInfiniteInput = z.infer<
  typeof getProfilesInfiniteSchema
>;
export const getProfilesInfiniteSchema = z.object({
  limit: z.number().min(1).max(100).default(50),
  cursor: z.string().optional(),
  type: z.nativeEnum(ProfileType).optional(),
});

export type GetProfilesInput = z.infer<typeof getProfilesSchema>;
export const getProfilesSchema = getAllQuerySchema.extend({
  type: z.nativeEnum(ProfileType).optional(),
});
