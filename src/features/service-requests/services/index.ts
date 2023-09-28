import { api } from '@/utils/api';

import type {
  GetAllServiceCategoriesInput,
  GetAllServiceCategoriesOptions,
  GetAllServiceRequestsInput,
  GetAllServiceRequestsOptions,
  GetAllservicesInput,
  GetAllservicesOptions,
  GetServiceRequestInput,
  GetServiceRequestOffersInput,
  GetServiceRequestOffersOptions,
  GetServiceRequestOptions,
  PublishServiceRequestOptions,
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

export const useGetServiceRequest = (
  inputs: GetServiceRequestInput,
  options?: GetServiceRequestOptions
) => {
  return api.services.getServiceRequest.useQuery(inputs, {
    ...options,
  });
};

export const useServiceRequestOffers = (
  inputs: GetServiceRequestOffersInput,
  options?: GetServiceRequestOffersOptions
) => {
  return api.services.getServiceRequestOffers.useQuery(inputs, {
    ...options,
  });
};

export const useGetAllServiceRequests = (
  inputs: GetAllServiceRequestsInput,
  options?: GetAllServiceRequestsOptions
) => {
  return api.services.getAllServiceRequests.useQuery(inputs, {
    ...options,
  });
};
