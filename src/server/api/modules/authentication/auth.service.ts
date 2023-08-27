import slugify from 'slugify';

import { createLocation } from '../locations';
import { createProfileByUserId } from '../profiles';
import { updateUserById } from '../users/users.repository';
import { getUserMessage } from './auth.utils';
import { type AuthValidation } from './auth.validations';

export const authService = async (data: AuthValidation) => {
  const { location, phone, profileType, userId } = data;

  const redirectUrl = profileType === 'PROVIDER' ? '/' : '/';

  //Create the location specified by the user
  const { id: locationId } = await createLocation({
    lat: location.lat,
    long: location.long,
    name: location.name,
    wikidata: location.wikidata,
  });

  //Update the user infos by phone and location created
  const { picture, fullName } = await updateUserById({
    id: userId,
    locationId,
    phone,
    hasBeenOnboarded: true,
  });

  //Create a profile for the given user
  const profile = await createProfileByUserId({
    userId,
    name: fullName,
    type: profileType,
    slug: slugify(fullName), //TODO create the slug function to properly handle this
    avatar: picture,
  });

  return {
    profile,
    redirectUrl,
    message: getUserMessage(fullName),
  };
};
