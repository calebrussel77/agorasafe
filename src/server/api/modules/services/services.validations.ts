import { z } from 'zod';

import { getAllQuerySchema } from '../../validations/base.validations';

export const getServicesSchema = getAllQuerySchema.extend({
  categoryServiceSlug: z.string().trim().optional(),
  categoryServiceId: z.string().trim().optional(),
});

export type GetServicesInput = z.infer<typeof getServicesSchema>;
