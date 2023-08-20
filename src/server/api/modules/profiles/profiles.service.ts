import { USER_PROFILES_LIMIT_COUNT } from '@/constants';
import slugify from 'slugify';

import {
  throwBadRequestError,
  throwNotFoundError,
} from '../../../utils/error-handling';
import { getUserById } from '../users';
import {
  createProfileByUserId,
  getProfilesByUserId,
} from './profiles.repository';
import { getProfileCreationrMessage } from './profiles.utils';
import {
  type CreateProfileValidation,
  type GetProfilesByUserIdValidation,
} from './profiles.validations';

export const getProfilesByUserIdService = async (
  inputs: GetProfilesByUserIdValidation
) => {
  const { userId, name } = inputs;

  //Get all profiles of the current user
  const profiles = await getProfilesByUserId(userId);

  return {
    profiles: profiles,
    message: `Ravie de vous avoir ${name}, Avec quel profil souhaitez-vous interagir ?`,
    success: true,
  };
};

export const createProfileService = async (inputs: CreateProfileValidation) => {
  const { name, profileType, userId } = inputs;

  const redirectUrl = profileType === 'PROVIDER' ? '/' : '/';

  const user = await getUserById(userId);

  if (!user) {
    throwNotFoundError('Utilisateur non trouvé !');
  }

  if (user?._count.profiles === USER_PROFILES_LIMIT_COUNT) {
    throwBadRequestError(
      `Vous ne pouvez utliser que maximum ${USER_PROFILES_LIMIT_COUNT} Profils pour votre compte !`
    );
  }

  //Create a profile for the given user
  const profile = await createProfileByUserId({
    userId,
    name: name,
    type: profileType,
    slug: slugify(name, { lower: true }), //TODO create the slug function to properly handle this
  });

  return {
    profile,
    redirectUrl,
    message: getProfileCreationrMessage(name),
  };
};
