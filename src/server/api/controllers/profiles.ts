import slugify from 'slugify';

import { createProfileByUserId, getUserProfiles } from '../repositories';
import { type CreateProfile } from '../types/profiles';

export const getUserProfilesController = async (inputs: {
  userId: string;
  name: string;
}) => {
  const { userId, name } = inputs;

  try {
    //Get all profiels of the current user
    const profiles = await getUserProfiles(userId);

    return {
      profiles,
      message: `Ravie de vous avoir ${name}, Avec quel profile souhaitez-vous interagir ?`,
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
    //Create a profile for the given user
    const profile = await createProfileByUserId({
      userId,
      name: name,
      type: profile_type,
      slug: slugify(name), //TODO create the slug function to properly handle this
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
