import { uniqWith } from '@/utils/arrays';
import { formatPhoneNumber } from '@/utils/misc';

import { type GetAllQueryInput } from '../../validations/base.validations';
import {
  createServiceRequest,
  createServiceRequestComment,
  getAllCategoryServices,
  getAllServiceRequests,
  getAllServicesWithCategory,
  getServiceRequestComments,
  getServiceRequestWithDetails,
  updateServiceRequest,
} from './services.repository';
import {
  getFomattedProviderNeeded,
  getFormattedDatePeriod,
  getFormattedDuration,
  getFormattedEstimatedPrice,
} from './services.utils';
import type {
  CreateServiceRequestCommentInput,
  CreateServiceRequestInput,
  GetAllServiceRequestsInput,
  GetAllServicesWithCategoryInput,
  GetServiceRequestCommentsInput,
  GetServiceRequestInput,
  UpdateServiceRequestInput,
} from './services.validations';

export const getAllServicesService = async (
  inputs: GetAllServicesWithCategoryInput
) => {
  const services = await getAllServicesWithCategory(inputs);

  return {
    services,
    success: true,
  };
};

export const getAllCategoryServicesService = async (
  inputs: GetAllQueryInput
) => {
  const categories = await getAllCategoryServices(inputs);

  return {
    categories,
    success: true,
  };
};

export const createServiceRequestCommentService = async (
  inputs: CreateServiceRequestCommentInput,
  profileId: string
) => {
  const serviceRequestOffer = await createServiceRequestComment({
    inputs,
    profileId,
  });

  return {
    serviceRequestOffer,
    success: true,
  };
};
export const createServiceRequestService = async (
  inputs: CreateServiceRequestInput,
  profileId: string
) => {
  const serviceRequest = await createServiceRequest({ inputs, profileId });

  return {
    serviceRequest,
    success: true,
  };
};

export const updateServiceRequestService = async (
  inputs: UpdateServiceRequestInput
) => {
  const updatedServiceRequest = await updateServiceRequest({ inputs });

  return {
    updatedServiceRequest,
    success: true,
  };
};

export const getServiceRequestService = async (
  inputs: GetServiceRequestInput
) => {
  const serviceRequestDetails = await getServiceRequestWithDetails({
    inputs,
  });

  return {
    serviceRequest: {
      ...serviceRequestDetails,
      phoneToContactFormatted: formatPhoneNumber(
        serviceRequestDetails?.phoneToContact || ''
      ),
      datePeriodFormattedText: getFormattedDatePeriod(
        serviceRequestDetails?.date,
        serviceRequestDetails?.startHour
      ),
      nbHoursFomattedText: getFormattedDuration(
        serviceRequestDetails?.nbOfHours
      ),
      nbProviderNeededFormattedText: getFomattedProviderNeeded(
        serviceRequestDetails?.numberOfProviderNeeded
      ),
      estimatedPriceFormatted: getFormattedEstimatedPrice(
        serviceRequestDetails?.estimatedPrice,
        'Prix non défini'
      ),
      // isProfileChoosed,
    },
    success: true,
  };
};

export const getServiceRequestCommentsService = async (
  inputs: GetServiceRequestCommentsInput
) => {
  const serviceRequestComments = await getServiceRequestComments({
    inputs,
  });

  return {
    serviceRequestComments,
    success: true,
  };
};

export const getAllServiceRequestsService = async (
  inputs: GetAllServiceRequestsInput
) => {
  const serviceRequests = await getAllServiceRequests(inputs);
  const _serviceRequests = serviceRequests.map(serviceRequest => ({
    ...serviceRequest,
    nbHoursFomattedText: getFormattedDuration(serviceRequest?.nbOfHours),
    nbProviderNeededFormattedText: getFomattedProviderNeeded(
      serviceRequest?.numberOfProviderNeeded
    ),
    comments: uniqWith(
      serviceRequest.comments,
      (a, b) => a.author.slug === b.author.slug
    ),
    estimatedPriceFormatted: getFormattedEstimatedPrice(
      serviceRequest?.estimatedPrice,
      'Prix non défini'
    ),
  }));

  return {
    serviceRequests: _serviceRequests,
    success: true,
  };
};
