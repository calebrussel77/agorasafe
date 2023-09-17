import { formatPhoneNumber } from '@/utils/misc';

import { throwBadRequestError } from '@/server/utils/error-handling';

import { type GetAllQueryInput } from '../../validations/base.validations';
import {
  createServiceRequest,
  getAllCategoryServices,
  getAllServicesWithCategory,
  getServiceRequestOffers,
  getServiceRequestWithDetails,
} from './services.repository';
import {
  getFomattedProviderNeeded,
  getFormattedDatePeriod,
  getFormattedDuration,
} from './services.utils';
import type {
  CreateServiceRequestInput,
  GetAllServicesWithCategoryInput,
  GetServiceRequestInput,
  GetServiceRequestOffersInput,
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

export const getServiceRequestService = async (
  inputs: GetServiceRequestInput,
  profileId: string
) => {
  const serviceRequestDetails = await getServiceRequestWithDetails({
    inputs,
  });

  const isProfileChoosed = serviceRequestDetails?.choosedProviders?.some(
    choosedProvider => choosedProvider.provider.profile.id === profileId
  );

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
      isProfileChoosed,
    },
    success: true,
  };
};

export const getServiceRequestOffersService = async (
  inputs: GetServiceRequestOffersInput
) => {
  const serviceRequestOffers = await getServiceRequestOffers({
    inputs,
  });

  return {
    serviceRequestOffers,
    success: true,
  };
};
