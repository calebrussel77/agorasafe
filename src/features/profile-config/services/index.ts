import { api } from '@/utils/api';

import {
  type GetProfileConfigOptions,
} from '../types';

export const useGetProfileConfig = ({
  ...restOptions
}: GetProfileConfigOptions = {}) => {
  const data = api.profileConfig.getProfileConfig.useQuery(undefined, {
    ...restOptions,
  });

  return data;
};
