import { api } from '@/utils/api';

import type {
  GetAllServiceCategoriesInput,
  GetAllServiceCategoriesOptions,
  GetAllservicesInput,
  GetAllservicesOptions,
  GetServiceRequestInput,
  GetServiceRequestOffersInput,
  GetServiceRequestOffersOptions,
  GetServiceRequestOptions,
  PublishServiceRequestOptions,
  UpdateServiceRequestOptions,
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

export const useUpdateServiceRequest = ({
  onSuccess,
  onError,
  ...restOptions
}: UpdateServiceRequestOptions = {}) => {
  const queryUtils = api.useContext();

  const data = api.services.updateServiceRequest.useMutation({
    async onSuccess(data, variables, ctx) {
      //Invalidate single service request query 
      await queryUtils.services.getServiceRequest.invalidate({slug: data?.updatedServiceRequest?.slug});
      
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
