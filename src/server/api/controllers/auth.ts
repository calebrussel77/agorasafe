import slugify from 'slugify';

import {
  createLocation,
  createProfileByUserId,
  updateUserById,
} from '../repositories';
import { type UserRegister } from '../types/auth';

export const userRegisterController = async (
  inputs: UserRegister & { userId: string }
) => {
  const { location, phone, profile_type, userId } = inputs;
  const redirect_uri = profile_type === 'PROVIDER' ? '/' : '/';

  try {
    //Create the location specified by the user
    const { id: locationId } = await createLocation({
      lat: location.lat,
      long: location.long,
      name: location.name,
      wikidata: location.wikidata,
    });

    //Update the user infos by phone and location created
    const { picture, full_name } = await updateUserById({
      id: userId,
      locationId,
      phone,
    });

    //Create a profile for the given user
    const profile = await createProfileByUserId({
      userId,
      name: full_name,
      type: profile_type,
      slug: slugify(full_name), //TODO create the slug function to properly handle this
      avatar: picture,
    });

    return {
      profile,
      redirect_uri,
      message: `Ravie de vous avoir parmi nous ${full_name} !`,
      success: true,
    };
  } catch (error) {
    throw new Error(error as string);
  }
};
