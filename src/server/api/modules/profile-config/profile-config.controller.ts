import { TRPCError } from '@trpc/server';

import { getProfileConfigService } from './profile-config.service';
import { type GetProfileConfigValidation } from './profile-config.validations';

export const getProfileConfigController = async (
  inputs: GetProfileConfigValidation
) => {
  try {
    const serviceResponse = await getProfileConfigService(inputs);

    return {
      ...serviceResponse,
      success: true,
    };
  } catch (error) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: error as string });
  }
};
