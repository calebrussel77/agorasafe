import { type z } from 'zod';

import { type createProfileSchema } from '../validations/profiles';

export type CreateProfile = z.infer<typeof createProfileSchema>;
