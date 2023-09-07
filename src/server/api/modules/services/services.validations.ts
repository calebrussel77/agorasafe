import { z } from 'zod';

import { getAllQuerySchema } from '../../validations/base.validations';

export const getAllServicesWithCategorySchema = getAllQuerySchema.extend({
  categoryServiceSlug: z.string().trim().optional(),
  categoryServiceId: z.string().trim().optional(),
});

export type GetAllServicesWithCategoryInput = z.infer<
  typeof getAllServicesWithCategorySchema
>;
