import { ProfileType } from '@prisma/client';
import { z } from 'zod';

export const createProfileSchema = z.object({
  name: z.string().trim(),
  profile_type: z.nativeEnum(ProfileType),
});
