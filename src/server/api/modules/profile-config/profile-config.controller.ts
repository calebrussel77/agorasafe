import { throwDbError } from '../../../utils/error-handling';
import { getProfileConfigService } from './profile-config.service';

export const getProfileConfigController = async (
  profileId: string,
  userId: string
) => {
  try {
    const serviceResponse = await getProfileConfigService({
      profileId,
      userId,
    });

    return {
      ...serviceResponse,
      success: true,
    };
  } catch (e) {
    throwDbError(e);
  }
};
