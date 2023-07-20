import { USER_PROFILES_LIMIT_COUNT } from '@/constants';
import slugify from 'slugify';

import {
  createProfileByUserId,
  getProfilesByUserId,
  getUserById,
} from '../repositories';
import { type CreateProfile } from '../types/profiles';

export const getProfilesByUserIdController = async (inputs: {
  userId: string;
  name: string;
}) => {
  const { userId, name } = inputs;

  try {
    //Get all profiels of the current user
    const profiles = await getProfilesByUserId(userId);

    return {
      profiles,
      message: `Ravie de vous avoir ${name}, Avec quel profil souhaitez-vous interagir ?`,
      success: true,
    };
  } catch (error) {
    throw new Error(error as string);
  }
};

export const createProfileController = async (
  inputs: CreateProfile & { userId: string }
) => {
  const { name, profile_type, userId } = inputs;

  try {
    const user = await getUserById(userId);

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
      userId,
      name: name,
      type: profile_type,
      slug: slugify(name, { lower: true }), //TODO create the slug function to properly handle this
    });

    return {
      profile,
      message: `Le profil ${name} a bien été crée !`,
      success: true,
    };
  } catch (error) {
    throw new Error(error as string);
  }
};
