import { api } from '@/utils/api';

import type {
  CreateServiceRequestCommentOptions,
  GetAllServiceCategoriesInput,
  GetAllServiceCategoriesOptions,
  GetAllServiceRequestsInput,
  GetAllServiceRequestsOptions,
  GetAllservicesInput,
  GetAllservicesOptions,
  GetServiceRequestCommentsInput,
  GetServiceRequestCommentsOptions,
  GetServiceRequestInput,
  GetServiceRequestOptions,
  PublishServiceRequestOptions,
  ToggleServiceRequestReservationOptions,
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

export const useToggleServiceRequestReservation = ({
  onSuccess,
  onError,
  ...restOptions
}: ToggleServiceRequestReservationOptions = {}) => {
  const data = api.services.toggleServiceRequestReservation.useMutation({
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

export const useCreateServiceRequestComment = ({
  onSuccess,
  onError,
  ...restOptions
}: CreateServiceRequestCommentOptions = {}) => {
  const data = api.services.createServiceRequestComment.useMutation({
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

export const useServiceRequestComments = (
  inputs: GetServiceRequestCommentsInput,
  options?: GetServiceRequestCommentsOptions
) => {
  return api.services.getServiceRequestComments.useQuery(inputs, {
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
