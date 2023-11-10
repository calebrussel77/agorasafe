import { throwDbError } from '../../../utils/error-handling';
import { type GetByIdOrSlugQueryInput } from '../../validations/base.validations';
import {
  getProfileDetailsService,
  getProfilesByUserIdService,
} from './profiles.service';
import { type GetProfilesByUserIdValidation } from './profiles.validations';

export const getProfileDetailsController = async (
  inputs: GetByIdOrSlugQueryInput
) => {
  try {
    return await getProfileDetailsService(inputs);
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
