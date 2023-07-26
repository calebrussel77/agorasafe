import { USER_PROFILES_LIMIT_COUNT } from '@/constants';
import slugify from 'slugify';

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
  const { user_id, name } = inputs;

  //Get all profiles of the current user
  const profiles = await getProfilesByUserId(user_id);

  return {
    profiles,
    message: `Ravie de vous avoir ${name}, Avec quel profil souhaitez-vous interagir ?`,
    success: true,
  };
};

export const createProfileService = async (inputs: CreateProfileValidation) => {
  const { name, profile_type, user_id } = inputs;

  const user = await getUserById(user_id);

  if (!user) {
    throw new Error('Utilisateur non trouvé !');
  }

  if (user?._count.profiles === USER_PROFILES_LIMIT_COUNT) {
    throw new Error(
      'Vous ne pouvez ajouter que maximum 02 Profils pour votre compte !'
    );
  }

  //Create a profile for the given user
  const profile = await createProfileByUserId({
    user_id,
    name: name,
    type: profile_type,
    slug: slugify(name, { lower: true }), //TODO create the slug function to properly handle this
  });

  return {
    profile,
    message: getProfileCreationrMessage(name),
  };
};
