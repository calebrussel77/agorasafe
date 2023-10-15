import { uniqWith } from '@/utils/arrays';
import { formatPhoneNumber } from '@/utils/misc';

import {
  throwForbiddenError,
  throwNotFoundError,
} from '@/server/utils/error-handling';

import { type GetAllQueryInput } from '../../validations/base.validations';
import {
  createServiceRequest,
  createServiceRequestComment,
  createServiceRequestReservation,
  getAllCategoryServices,
  getAllServiceRequests,
  getAllServicesWithCategory,
  getServiceRequestComments,
  getServiceRequestWithDetails,
  getServiceRequestWithReservedProviders,
  updateServiceRequest,
  updateServiceRequestReservation,
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
  ToggleServiceRequestReservationInput,
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

export const toggleServiceRequestReservationService = async (
  inputs: ToggleServiceRequestReservationInput
) => {
  const { customerProfileId, providerProfileId, serviceRequestId } = inputs;

  const serviceRequest = await getServiceRequestWithReservedProviders({
    inputs: { id: serviceRequestId },
  });

  if (!serviceRequest) {
    throwNotFoundError('Demande de service non trouvée !');
  }

  if (serviceRequest.status === 'CLOSED') {
    throwForbiddenError('Cette demande à été clôturée !');
  }

  // const activeReservedProvidersCount = serviceRequest?.providersReserved.filter(
  //   el => el.isActive && el.removedAt === null
  // )?.length;
  // if (
  //   serviceRequest?.numberOfProviderNeeded === activeReservedProvidersCount
  // ) {
  //   throwForbiddenError(
  //     'Vous ne pouvez plus rajouter un prestataire à votre liste de reservation !'
  //   );
  // }

  const isProviderInReservations = serviceRequest.providersReserved.some(
    el => el.providerProfileId === providerProfileId
  );

  const isProviderReservedAndActive = serviceRequest.providersReserved.some(
    el =>
      el.providerProfileId === providerProfileId &&
      el.isActive &&
      el.removedAt === null
  );

  if (!isProviderInReservations) {
    const serviceRequestReservation = await createServiceRequestReservation({
      inputs: {
        customerProfileId,
        providerProfileId,
        serviceRequestId,
      },
    });
    return {
      serviceRequestReservation,
      message:
        'Le prestataire a bien été ajouté à votre liste de reservation pour la demande !',
      success: true,
    };
  }

  if (isProviderReservedAndActive) {
    const serviceRequestReservation = await updateServiceRequestReservation({
      inputs: {
        customerProfileId,
        providerProfileId,
        serviceRequestId,
      },
      data: {
        removedAt: new Date(),
        isActive: false,
      },
    });
    return {
      serviceRequestReservation,
      message:
        'Le prestataire a bien été rétiré de votre liste de reservation pour la demande !',
      success: true,
    };
  }

  const serviceRequestReservation = await updateServiceRequestReservation({
    inputs: {
      customerProfileId,
      providerProfileId,
      serviceRequestId,
    },
    data: {
      removedAt: null,
      isActive: true,
    },
  });

  return {
    serviceRequestReservation,
    message:
      'Le prestataire a bien été rajouté à votre liste de reservation pour la demande !',
    success: true,
  };
};

export const getServiceRequestService = async (
  inputs: GetServiceRequestInput
) => {
  const serviceRequestDetails = await getServiceRequestWithDetails({
    inputs,
  });

  if (!serviceRequestDetails) {
    throwNotFoundError('Demande de service non trouvée !');
  }

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

  if (!serviceRequestComments) {
    throwNotFoundError('Commentaires de la demande non trouvés !');
  }

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
