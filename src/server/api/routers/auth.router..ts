import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import {
  authController,
  authValidationSchema,
} from '../modules/authentication';

export const authRouter = createTRPCRouter({
  userRegister: protectedProcedure
    .input(authValidationSchema)
    .mutation(({ input, ctx: { session } }) =>
      authController({ ...input, userId: session.user.id })
    ),
});
