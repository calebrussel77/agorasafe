import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

import {
  getAllServicesHandler,
  getServiceCategoriesHandler,
  getServicesSchema,
} from '../modules/services';
import { getAllQuerySchema } from '../validations/base.validations';

export const servicesRouter = createTRPCRouter({
  getAllServiceCategory: publicProcedure
    .input(getAllQuerySchema)
    .query(getServiceCategoriesHandler),

  getAll: publicProcedure.input(getServicesSchema).query(getAllServicesHandler),
});
