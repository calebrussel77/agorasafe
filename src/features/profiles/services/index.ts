import { api } from '@/utils/api';

import {
  type CreateProfileOptions,
  GetProfileDetailsInput,
  GetProfileDetailsOptions,
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

export const useCreateProfile = ({
  onSuccess,
  onError,
  ...restOptions
}: CreateProfileOptions = {}) => {
  const data = api.profiles.createProfile.useMutation({
    onSuccess(data, variables, ctx) {
      onSuccess?.(data, variables, ctx);
    },
    onError(err, variables, context) {
      console.error(err.message);
      onError?.(err, variables, context);
    },
    ...restOptions,
  });

  return data;
};
