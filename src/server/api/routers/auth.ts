import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import { userRegisterController } from '../controllers';
import { userRegisterSchema } from '../validations/auth';

export const authRouter = createTRPCRouter({
  userRegister: protectedProcedure
    .input(userRegisterSchema)
    .mutation(({ input, ctx: { session } }) =>
      userRegisterController({ ...input, userId: session.user.id })
    ),
});
