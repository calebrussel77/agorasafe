import { TRPCError } from '@trpc/server';

import { authService } from './auth.service';
import { type AuthValidation } from './auth.validations';

export const authController = async (inputs: AuthValidation) => {
  try {
    const serviceResponse = await authService(inputs);

    return {
      ...serviceResponse,
      success: true,
    };
  } catch (error) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: error as string });
  }
};
