import { throwDbError } from '../../utils/error-handling';
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
    return await createProfileService(inputs);
  } catch (error) {
    throwDbError(error);
  }
};

export const getProfilesByUserIdController = async (
  inputs: GetProfilesByUserIdValidation
) => {
  try {
    return await getProfilesByUserIdService(inputs);
  } catch (error) {
    throwDbError(error);
  }
};
