import { api } from '@/utils/api';

import {
  type GetAllServiceCategoriesInput,
  type GetAllServiceCategoriesOptions,
  type GetAllservicesInput,
  type GetAllservicesOptions,
  type PublishServiceRequestOptions,
} from '../types';

export const useGetAllServices = (
  inputs: GetAllservicesInput = {},
  { ...restOptions }: GetAllservicesOptions = {}
) => {
  return api.services.getAllservices.useQuery(inputs, {
    ...restOptions,
  });
};

export const useGetAllServiceCategories = (
  inputs: GetAllServiceCategoriesInput = {},
  { ...restOptions }: GetAllServiceCategoriesOptions = {}
) => {
  return api.services.getAllServiceCategories.useQuery(inputs, {
    ...restOptions,
  });
};

export const useCreateServiceRequest = ({
  onSuccess,
  onError,
  ...restOptions
}: PublishServiceRequestOptions = {}) => {
  const data = api.services.publishServiceRequest.useMutation({
    onSuccess(data, variables, ctx) {
      onSuccess?.(data, variables, ctx);
    },
    onError(err, variables, context) {
      onError?.(err, variables, context);
    },
    ...restOptions,
  });

  return data;
};

export const useGetServiceRequest = (id: string) => {};
