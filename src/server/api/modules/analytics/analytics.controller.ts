import { dateToReadableString } from '@/lib/date-fns';

import { throwDbError } from '../../../utils/error-handling';
import { type Context } from '../../create-context';
import {
  getAverageRatingGivenByCustomer,
  getAverageRatingReceived,
  getProfileViewCountRange,
  getProposalsAcceptanceRate,
  getProposalsByProviderCount,
  getServiceRequestsConversionRate,
  getServiceRequestsCountRange,
} from './analytics.repository';
import {
  GetProfileViewCountRangeInput,
  type GetServiceRequestsCountRangeInput,
} from './analytics.validations';

interface RequestsFormattedData {
  name: string;
  'Nombre de demandes crée': number;
}

function formatRequestsDataForBarChart(
  serviceRequests: Array<{ createdAt: Date }>
): RequestsFormattedData[] {
  const serviceRequestsByDate: Record<string, number> = {};

  // Parcours chaque demande de service pour compter le nombre de demandes par date
  serviceRequests.forEach(request => {
    const date = dateToReadableString(request.createdAt);
    if (serviceRequestsByDate[date]) {
      serviceRequestsByDate[date]++;
    } else {
      serviceRequestsByDate[date] = 1;
    }
  });
  // Transforme l'objet en un tableau d'objets avec la structure attendue pour le graphique
  const formattedData = Object.entries(serviceRequestsByDate).map(
    ([date, count]) => ({
      name: date,
      'Nombre de demandes crée': count,
    })
  );

  return formattedData;
}

interface ProfileViewsFormattedData {
  name: string;
  'Nombre de vues du profil': number;
}

function formatProfileViewDataForBarChart(
  serviceRequests: Array<{ createdAt: Date }>
): ProfileViewsFormattedData[] {
  const profileViewsByDate: Record<string, number> = {};

  // Parcours chaque demande de service pour compter le nombre de demandes par date
  serviceRequests.forEach(request => {
    const date = dateToReadableString(request.createdAt);
    if (profileViewsByDate[date]) {
      profileViewsByDate[date]++;
    } else {
      profileViewsByDate[date] = 1;
    }
  });
  // Transforme l'objet en un tableau d'objets avec la structure attendue pour le graphique
  const formattedData = Object.entries(profileViewsByDate).map(
    ([date, count]) => ({
      name: date,
      'Nombre de vues du profil': count,
    })
  );

  return formattedData;
}

export const getServiceRequestsCountRangeHandler = async ({
  ctx,
  input,
}: {
  ctx: DeepNonNullable<Context>;
  input: GetServiceRequestsCountRangeInput;
}) => {
  try {
    const serviceRequests = await getServiceRequestsCountRange({
      input,
      profileId: ctx.profile.id,
    });

    return {
      timeSeriesData: {
        categoriesName: ['Nombre de demandes crée'],
        data: formatRequestsDataForBarChart(serviceRequests),
        index: 'name',
      },
      serviceRequests,
    };
  } catch (error) {
    throw throwDbError(error);
  }
};

export const getProfileViewCountRangeHandler = async ({
  ctx,
  input,
}: {
  ctx: DeepNonNullable<Context>;
  input: GetProfileViewCountRangeInput;
}) => {
  try {
    const serviceRequests = await getProfileViewCountRange({
      input,
      profileId: ctx.profile.id,
    });

    return {
      timeSeriesData: {
        categoriesName: ['Nombre de vues du profil'],
        data: formatProfileViewDataForBarChart(serviceRequests),
        index: 'name',
      },
      serviceRequests,
    };
  } catch (error) {
    throw throwDbError(error);
  }
};

export const getCustomerProfileAnalyticsHandler = async ({
  ctx,
}: {
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    const [requestsData, ratingsData] = await Promise.all([
      getServiceRequestsConversionRate(ctx.profile.id),
      getAverageRatingGivenByCustomer(ctx.profile.id),
    ]);

    return {
      ...ratingsData,
      ...requestsData,
    };
  } catch (error) {
    throw throwDbError(error);
  }
};

export const getProviderProfileAnalyticsHandler = async ({
  ctx,
}: {
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    const [totalProposalCount, proposalAcceptanceRate, ratingData] =
      await Promise.all([
        getProposalsByProviderCount(ctx.profile.id),
        getProposalsAcceptanceRate(ctx.profile.id),
        getAverageRatingReceived(ctx.profile.id),
      ]);

    return {
      proposalAcceptanceRate,
      totalProposalCount,
      ...ratingData,
    };
  } catch (error) {
    throw throwDbError(error);
  }
};
