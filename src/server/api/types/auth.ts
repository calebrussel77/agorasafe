import { type z } from 'zod';

import { type userRegisterSchema } from '../validations/auth';

export type UserRegister = z.infer<typeof userRegisterSchema>;
