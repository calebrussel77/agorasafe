import { api } from '@/utils/api';

import {
  type GetProfileDetailsInput,
  type GetProfileDetailsOptions,
  type GetUserProfilesOptions,
} from '../types';

export const useUserProfiles = ({
  ...restOptions
}: GetUserProfilesOptions = {}) => {
  const data = api.profiles.getUserProfiles.useQuery(undefined, {
    ...restOptions,
  });

  return data;
};

export const useGetProfileDetails = (
  inputs: GetProfileDetailsInput,
  { ...restOptions }: GetProfileDetailsOptions = {}
) => {
  const data = api.profiles.getProfileDetails.useQuery(inputs, {
    ...restOptions,
  });

  return data;
};
