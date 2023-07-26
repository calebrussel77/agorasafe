import { api } from '@/utils/api';

import {
  type GetProfileConfigInput,
  type GetProfileConfigOptions,
} from '../types';

export const useGetProfileConfig = (
  inputs: GetProfileConfigInput,
  { ...restOptions }: GetProfileConfigOptions = {}
) => {
  const data = api.profileConfig.getProfileConfig.useQuery(inputs, {
    ...restOptions,
  });

  return data;
};
