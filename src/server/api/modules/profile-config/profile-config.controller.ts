import { throwDbError } from '../../../utils/error-handling';
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
  } catch (e) {
    throwDbError(e);
  }
};
