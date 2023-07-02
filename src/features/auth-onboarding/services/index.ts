import { api } from '@/utils/api';

import { type UserRegisterOptions } from '../types';

export const useUserRegister = ({
  onSuccess,
  onError,
  ...restOptions
}: UserRegisterOptions = {} ) => {
  const data = api.auth.userRegister.useMutation({
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
