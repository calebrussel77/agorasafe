import { formatPhoneNumber } from '@/utils/misc';

import {
  throwDbError,
  throwForbiddenError,
  throwNotFoundError,
} from '@/server/utils/error-handling';

import { type Context } from '../../create-context';
import {
  type GetByIdOrSlugQueryInput,
  GetByIdQueryInput,
} from '../../validations/base.validations';
import { createProposal, getProposals, updateProposal } from '../proposals';
import { ProposalSelect } from '../proposals/proposals.select';
import {
  createServiceRequest,
  createServiceRequestComment,
  createServiceRequestReservation,
  deleteServiceRequest,
  getAllServiceRequests,
  getServiceRequestProposals,
  getServiceRequestReservedProviders,
  getServiceRequestStats,
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
  input: GetByIdOrSlugQueryInput &
    Pick<GetServiceRequestInput, 'providersReserved'>;
  ctx: Context;
}) => {
  try {
    const response = await getServiceRequestReservedProviders({
      input,
    });

    if (!response) throwNotFoundError('Demande de service non trouvée');

    const reservedProviders = response?.providersReserved?.map(el => {
      return {
        profile: el.provider.profile,
        proposal: el.proposal,
        skills: el.provider.skills,
        profession: el.provider.profession,
      };
    });

    return {
      id: response.id,
      status: response.status,
      author: response.author,
      reservedProviders,
    };
  } catch (e) {
    throwDbError(e);
  }
};

export const getServiceRequestProposalsHandler = async ({
  ctx,
  input,
}: {
  input: GetByIdQueryInput & { isAcrhived?: boolean };
  ctx: Context;
}) => {
  try {
    const proposals = await getProposals({
      where: {
        serviceRequestId: input.id,
        isArchived: input.isAcrhived ?? false,
      },
      select: { ...ProposalSelect, serviceRequestId: true },
    });

    if (!proposals) throwNotFoundError('Demande de service non trouvée');

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
    const authorProfileId = ctx.profile.id;

    const { providerProfileId, serviceRequestId, proposalId } = input;

    // Get all providers reserved list
    const serviceRequest = await getServiceRequestReservedProviders({
      input: { id: serviceRequestId, providersReserved: 'All' },
    });

    if (!serviceRequest) {
      throwNotFoundError('Demande de service non trouvée !');
    }

    if (serviceRequest.status === 'CLOSED') {
      throwForbiddenError('Cette demande à été clôturée !');
    }

    const activeReservedProvidersCount =
      serviceRequest?.providersReserved.filter(
        el => el.isActive && el.removedAt === null
      )?.length || 0;

    if (
      serviceRequest?.numberOfProviderNeeded === activeReservedProvidersCount
    ) {
      throwForbiddenError(
        'Vous ne pouvez plus rajouter un prestataire à votre demande. Le nombre de prestataire demandé est atteint !'
      );
    }

    if (serviceRequest?.author?.profile?.id !== authorProfileId) {
      throwForbiddenError("Vous n'avez pas le droit d'éffectuer cette action.");
    }

    const isProviderInReservations = serviceRequest.providersReserved.some(
      el => el.provider.profile.id === providerProfileId
    );

    if (!isProviderInReservations) {
      // we update the provider proposal to be archived
      if (proposalId) {
        await updateProposal({
          where: { id: proposalId },
          data: { isArchived: true },
        });
      }

      // we update the provider info to be in the list (active and visible)
      const serviceRequestReservation = await createServiceRequestReservation({
        authorProfileId,
        input: {
          providerProfileId,
          serviceRequestId,
          proposalId,
        },
      });
      return {
        serviceRequestReservation,
        message:
          'Le prestataire a bien été ajouté à votre liste de reservation pour la demande !',
        success: true,
      };
    }

    const providerFinded = serviceRequest.providersReserved.find(
      el => el.providerProfileId === providerProfileId
    );

    if (!providerFinded) {
      throwForbiddenError("Une erreur inattendue s'est produite");
    }

    // we know that the provider is already on the list
    // check if provider is active and visible
    if (providerFinded.isActive && providerFinded.removedAt === null) {
      //?REFLEXION : Need to know see if we want to display the provider proposal if existing here

      // we update the provider info to be inactive and invisible
      const serviceRequestReservation = await updateServiceRequestReservation({
        input: {
          authorProfileId,
          providerProfileId,
          serviceRequestId,
          proposalId,
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

    // we update the provider proposal to be archived
    if (proposalId) {
      await updateProposal({
        where: { id: proposalId },
        data: { isArchived: true },
      });
    }

    // we update the provider info to be active and visible
    const serviceRequestReservation = await updateServiceRequestReservation({
      input: {
        authorProfileId,
        providerProfileId,
        serviceRequestId,
        proposalId,
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
  input: { serviceRequestId, ...input },
}: {
  input: CreateServiceRequestProposalInput;
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    const proposal = await createProposal({
      data: {
        author: { connect: { profileId: ctx.profile.id } },
        serviceRequest: { connect: { id: serviceRequestId } },
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
      // select: { serviceRequest: { select: { id: true } } },
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
    //Archive proposal
    const proposal = await updateProposal({
      where: { id: input.id },
      data: { isArchived: true },
    });

    return {
      proposal,
      success: true,
    };
  } catch (e) {
    throwDbError(e);
  }
};

export const deleteServiceRequestHandler = async ({
  ctx,
  input,
}: {
  input: { id: string };
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    const deletedServiceRequest = await deleteServiceRequest({
      id: input.id,
    });

    return {
      deletedServiceRequest,
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
        isProfileReserved: serviceRequestDetails?.providersReserved?.some(
          provider => provider.providerProfileId === ctx.profile?.id
        ),
        hasProposalSubmitted: serviceRequestDetails?.proposals?.some(
          proposal => proposal.author.profileId === ctx.profile?.id
        ),
      },
      success: true,
    };
  } catch (e) {
    throwDbError(e);
  }
};

export const getServiceRequestStatsHandler = async ({
  ctx,
  input,
}: {
  input: GetServiceRequestInput;
  ctx: Context;
}) => {
  try {
    const serviceRequestDetails = await getServiceRequestStats({
      input,
    });

    if (!serviceRequestDetails) {
      throwNotFoundError('Demande de service non trouvée !');
    }

    return {
      commentCount: serviceRequestDetails?._count?.comments,
      providersReservedCount: serviceRequestDetails?._count?.providersReserved,
      reviewCount: serviceRequestDetails?._count?.reviews,
      photoCount: serviceRequestDetails?._count?.photos,
      proposalCount: serviceRequestDetails?._count?.proposals,
    };
  } catch (e) {
    throwDbError(e);
  }
};
