import { appPrimaryColor } from '@/constants';
import { BarChart, Card } from '@tremor/react';
import React, { type PropsWithChildren, useMemo } from 'react';

import { CenterContent } from '@/components/ui/layout';
import { Spinner } from '@/components/ui/spinner';
import { Typography } from '@/components/ui/typography';

import { api } from '@/utils/api';
import { abbreviateNumber } from '@/utils/number';

interface ProviderAnalyticsDashboardProps {
  className?: string;
}

const ProviderAnalyticsDashboard =
  ({}: PropsWithChildren<ProviderAnalyticsDashboardProps>) => {
    const { data: chartsData, isLoading: isLoadingCharts } =
      api.analytics.getProfileViewCountRange.useQuery({ isAll: true });

    const { data: stats, isLoading: isLoadingStats } =
      api.analytics.getProviderAnalytics.useQuery();

    const cardInfos = useMemo(() => {
      return [
        {
          label: `Moyenne d'avis reçu (${abbreviateNumber(
            stats?.totalReviews ?? 0
          )} avis)`,
          value: `${stats?.averageRating}`,
        },
        {
          label: "Taux d'acceptation des propositions",
          value: `${stats?.proposalAcceptanceRate}%`,
        },
        {
          label: 'Total des propositions',
          value: abbreviateNumber(stats?.totalProposalCount ?? 0),
        },
      ];
    }, [stats]);

    if (isLoadingCharts || isLoadingStats)
      return (
        <CenterContent>
          <Spinner variant="primary" />
        </CenterContent>
      );

    if (!chartsData || !stats) return null;

    const timeSeries = chartsData?.timeSeriesData;

    return (
      <div className="w-full space-y-6">
        <div className="mx-auto grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {cardInfos?.map(el => (
            <Card key={el.label} className="space-y-2">
              <Typography variant="small">{el.label}</Typography>
              <Typography as="h2" className="text-gray-900">
                {el.value}
              </Typography>
            </Card>
          ))}
        </div>
        {timeSeries ? (
          <Card>
            <BarChart
              className="h-80"
              allowDecimals={false}
              showAnimation
              data={timeSeries.data}
              categories={timeSeries.categoriesName}
              colors={[appPrimaryColor]}
              yAxisWidth={60}
              index={timeSeries.index}
            />
          </Card>
        ) : null}
      </div>
    );
  };

export { ProviderAnalyticsDashboard };
