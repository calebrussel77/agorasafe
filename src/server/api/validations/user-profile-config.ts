import { z } from 'zod';

export const userProfileConfigSchema = z.object({
  profileId: z.string().trim(),
});
