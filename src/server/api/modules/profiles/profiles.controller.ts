import { TRPCError } from '@trpc/server';

import {
  createProfileService,
  getProfilesByUserIdService,
} from './profiles.service';
import {
  type CreateProfileValidation,
  type GetProfilesByUserIdValidation,
} from './profiles.validations';

export const createProfileController = async (
  inputs: CreateProfileValidation
) => {
  try {
    const serviceResponse = await createProfileService(inputs);
    return {
      ...serviceResponse,
      success: true,
    };
  } catch (error) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: error as string });
  }
};

export const getProfilesByUserIdController = async (
  inputs: GetProfilesByUserIdValidation
) => {
  try {
    const serviceResponse = await getProfilesByUserIdService(inputs);
    return {
      ...serviceResponse,
      success: true,
    };
  } catch (error) {
    throw new TRPCError({ code: 'BAD_REQUEST', message: error as string });
  }
};
