import { appPrimaryColor } from '@/constants';
import { BarChart, Card } from '@tremor/react';
import React, { type PropsWithChildren, useMemo } from 'react';

import { CenterContent } from '@/components/ui/layout';
import { Spinner } from '@/components/ui/spinner';
import { Typography } from '@/components/ui/typography';

import { api } from '@/utils/api';
import { abbreviateNumber } from '@/utils/number';

interface CustomerAnalyticsDashboardProps {
  className?: string;
}

const CustomerAnalyticsDashboard =
  ({}: PropsWithChildren<CustomerAnalyticsDashboardProps>) => {
    const { data: chartsData, isLoading: isLoadingCharts } =
      api.analytics.getServiceRequestsCountRange.useQuery({ isAll: true });

    const { data: stats, isLoading: isLoadingStats } =
      api.analytics.getCustomerAnalytics.useQuery();

    const cardInfos = useMemo(() => {
      return [
        {
          label: `Moyenne d'avis donnés (${abbreviateNumber(
            stats?.totalRating ?? 0
          )} avis)`,
          value: abbreviateNumber(stats?.averageRating ?? 0),
        },
        {
          label: 'Taux de conversion des demandes',
          value: `${stats?.conversionRate}%`,
        },
        {
          label: 'Total demandes de service',
          value: `${stats?.totalRequests}`,
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

export { CustomerAnalyticsDashboard };
