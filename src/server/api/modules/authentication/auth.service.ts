import slugify from 'slugify';

import { createLocation } from '../locations';
import { createProfileByUserId } from '../profiles';
import { updateUserById } from '../users/users.repository';
import { getUserMessage } from './auth.utils';
import { type AuthValidation } from './auth.validations';

export const authService = async (data: AuthValidation) => {
  const { location, phone, profile_type, user_id } = data;

  const redirect_uri = profile_type === 'PROVIDER' ? '/' : '/';

  //Create the location specified by the user
  const { id: location_id } = await createLocation({
    lat: location.lat,
    long: location.long,
    name: location.name,
    wikidata: location.wikidata,
  });

  //Update the user infos by phone and location created
  const { picture, full_name } = await updateUserById({
    id: user_id,
    location_id,
    phone,
  });

  //Create a profile for the given user
  const profile = await createProfileByUserId({
    user_id,
    name: full_name,
    type: profile_type,
    slug: slugify(full_name), //TODO create the slug function to properly handle this
    avatar: picture,
  });

  return {
    profile,
    redirect_uri,
    message: getUserMessage(full_name),
  };
};
