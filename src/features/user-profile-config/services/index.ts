import { api } from '@/utils/api';

import {
  type GetUserProfileConfigInput,
  type GetUserProfileConfigOptions,
} from '../types';

export const useGetUserProfileConfig = (
  inputs: GetUserProfileConfigInput,
  { ...restOptions }: GetUserProfileConfigOptions = {}
) => {
  const data = api.userProfileConfig.getUserProfileConfig.useQuery(inputs, {
    ...restOptions,
  });

  return data;
};
