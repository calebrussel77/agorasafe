import { formatPhoneNumber } from '@/utils/misc';

import {
  throwDbError,
  throwForbiddenError,
  throwNotFoundError,
} from '@/server/utils/error-handling';

import { type Context } from '../../create-context';
import { type GetByIdOrSlugQueryInput } from '../../validations/base.validations';
import { createProposal, deleteProposal, updateProposal } from '../proposals';
import {
  createServiceRequest,
  createServiceRequestComment,
  createServiceRequestReservation,
  getAllServiceRequests,
  getServiceRequestProposals,
  getServiceRequestReservedProviders,
  getServiceRequestWithDetails,
  updateServiceRequest,
  updateServiceRequestReservation,
} from './service-requests.repository';
import {
  getFomattedProviderNeeded,
  getFormattedDatePeriod,
  getFormattedDuration,
  getFormattedEstimatedPrice,
} from './service-requests.utils';
import {
  type CreateServiceRequestCommentInput,
  type CreateServiceRequestInput,
  type CreateServiceRequestProposalInput,
  type GetAllServiceRequestsInput,
  type GetServiceRequestInput,
  type ToggleServiceRequestReservationInput,
  type UpdateServiceRequestInput,
  type UpdateServiceRequestProposalInput,
} from './service-requests.validations';

export const getServiceRequestReservedProvidersHandler = async ({
  ctx,
  input,
}: {
  input: GetByIdOrSlugQueryInput;
  ctx: Context;
}) => {
  try {
    const response = await getServiceRequestReservedProviders({
      input,
    });

    if (!response) throwNotFoundError('Demande de service non trouvée');

    const reservedProviders = response?.providersReserved?.map(el => {
      return el.provider.profile;
    });

    return reservedProviders;
  } catch (e) {
    throwDbError(e);
  }
};

export const getServiceRequestProposalsHandler = async ({
  ctx,
  input,
}: {
  input: GetByIdOrSlugQueryInput;
  ctx: Context;
}) => {
  try {
    const response = await getServiceRequestProposals({
      input,
    });

    if (!response) throwNotFoundError('Demande de service non trouvée');

    const proposals = response?.proposals?.map(el => {
      return el.author.profile;
    });

    return proposals;
  } catch (e) {
    throwDbError(e);
  }
};

export const getAllServiceRequestsHandler = async ({
  ctx,
  input,
}: {
  input: GetAllServiceRequestsInput;
  ctx: Context;
}) => {
  try {
    const [count, serviceRequests] = await getAllServiceRequests(input);

    const _serviceRequests = serviceRequests.map(serviceRequest => ({
      ...serviceRequest,
      reservedProviders:
        serviceRequest?.providersReserved?.map(el => el.provider.profile) || [],
      nbHoursFomattedText: getFormattedDuration(serviceRequest?.nbOfHours),
      nbProviderNeededFormattedText: getFomattedProviderNeeded(
        serviceRequest?.numberOfProviderNeeded
      ),
      estimatedPriceFormatted: getFormattedEstimatedPrice(
        serviceRequest?.estimatedPrice,
        'Prix non défini'
      ),
      stats: {
        commentCount: serviceRequest?._count?.comments,
        providersReservedCount: serviceRequest?._count?.providersReserved,
        reviewCount: serviceRequest?._count?.reviews,
        photoCount: serviceRequest?._count?.photos,
        proposalCount: serviceRequest?._count?.proposals,
      },
    }));

    return {
      serviceRequests: _serviceRequests,
      totalCount: count,
      success: true,
    };
  } catch (e) {
    throwDbError(e);
  }
};

export const toggleServiceRequestReservationHandler = async ({
  ctx,
  input,
}: {
  input: ToggleServiceRequestReservationInput;
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    const { customerProfileId, providerProfileId, serviceRequestId } = input;

    const serviceRequest = await getServiceRequestReservedProviders({
      input: { id: serviceRequestId },
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
        input: {
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
        input: {
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
      input: {
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
  } catch (e) {
    throwDbError(e);
  }
};

export const createServiceRequestCommentHandler = async ({
  ctx,
  input,
}: {
  input: CreateServiceRequestCommentInput;
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    const serviceRequestOffer = await createServiceRequestComment({
      input,
      profileId: ctx.profile.id,
    });

    return {
      serviceRequestOffer,
      success: true,
    };
  } catch (e) {
    throwDbError(e);
  }
};

export const createServiceRequestHandler = async ({
  ctx,
  input,
}: {
  input: CreateServiceRequestInput;
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    const serviceRequest = await createServiceRequest({
      input,
      profileId: ctx.profile.id,
    });

    return {
      serviceRequest,
      success: true,
    };
  } catch (e) {
    throwDbError(e);
  }
};

export const createServiceRequestProposalHandler = async ({
  ctx,
  input,
}: {
  input: CreateServiceRequestProposalInput;
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    const proposal = await createProposal({
      data: {
        author: { connect: { profileId: ctx.profile.id } },
        ...input,
      },
      select: { serviceRequest: { select: { id: true } } },
    });

    return {
      proposal,
      success: true,
    };
  } catch (e) {
    throwDbError(e);
  }
};

export const updateServiceRequestProposalHandler = async ({
  ctx,
  input,
}: {
  input: UpdateServiceRequestProposalInput;
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    const proposal = await updateProposal({
      where: {
        id: input.id,
        serviceRequestId: input.serviceRequestId,
      },
      data: {
        content: input.content,
        price: input.price,
      },
      select: { serviceRequest: { select: { id: true } } },
    });
    return {
      proposal,
      success: true,
    };
  } catch (e) {
    throwDbError(e);
  }
};

export const deleteServiceRequestProposalHandler = async ({
  ctx,
  input,
}: {
  input: { id: string };
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    const proposal = await deleteProposal({
      id: input.id,
    });

    return {
      proposal,
      success: true,
    };
  } catch (e) {
    throwDbError(e);
  }
};

export const updateServiceRequestHandler = async ({
  ctx,
  input,
}: {
  input: UpdateServiceRequestInput;
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    const updatedServiceRequest = await updateServiceRequest({ input });

    return {
      updatedServiceRequest,
      success: true,
    };
  } catch (e) {
    throwDbError(e);
  }
};

export const getServiceRequestHandler = async ({
  ctx,
  input,
}: {
  input: GetServiceRequestInput;
  ctx: Context;
}) => {
  try {
    const serviceRequestDetails = await getServiceRequestWithDetails({
      input,
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
        stats: {
          commentCount: serviceRequestDetails?._count?.comments,
          providersReservedCount:
            serviceRequestDetails?._count?.providersReserved,
          reviewCount: serviceRequestDetails?._count?.reviews,
          photoCount: serviceRequestDetails?._count?.photos,
          proposalCount: serviceRequestDetails?._count?.proposals,
        },
        isProfileReserved: serviceRequestDetails?.providersReserved?.some(
          provider => provider.providerProfileId === ctx.profile?.id
        ),
      },
      success: true,
    };
  } catch (e) {
    throwDbError(e);
  }
};
