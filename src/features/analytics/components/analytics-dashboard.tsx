import { BarChart, Card } from '@tremor/react';
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';

interface AnalyticsDashboardProps {
  avgVisitorsPerDay: string;
  amtVisitorsToday: number;
}

const Badge = ({ percentage }: { percentage: number }) => {
  const isPositive = percentage > 0;
  const isNeutral = percentage === 0;
  const isNegative = percentage < 0;

  if (isNaN(percentage)) return null;

  const positiveClassname =
    'bg-emerald-100 text-emerald-800 ring-emerald-600/10 ring-emerald-500';
  const neutralClassname =
    'bg-gray-100 text-gray-800 ring-gray-600/10 ring-gray-500';
  const negativeClassname =
    'bg-red-100 text-red-800 ring-red-600/10 ring-red-500';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
        isPositive
          ? positiveClassname
          : isNeutral
          ? neutralClassname
          : negativeClassname
      }`}
    >
      {isPositive ? <ArrowUpRight className="h-3 w-3" /> : null}
      {isNeutral ? <ArrowRight className="h-3 w-3" /> : null}
      {isNegative ? <ArrowDownRight className="h-3 w-3" /> : null}
      {percentage.toFixed(0)}%
    </span>
  );
};

const AnalyticsDashboard = ({
  avgVisitorsPerDay,
  amtVisitorsToday,
}: AnalyticsDashboardProps) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        <Card className="w-full">
          <p className="flex items-center gap-2.5 text-tremor-default text-tremor-content">
            Visitors today
            <Badge
              percentage={
                (amtVisitorsToday / Number(avgVisitorsPerDay) - 1) * 100
              }
            />
          </p>
          <p className="text-3xl font-semibold text-tremor-content-strong">
            {amtVisitorsToday}
          </p>
        </Card>
        <Card className="w-full">
          <p className="text-tremor-default text-tremor-content">
            Avg. visitors/day
          </p>
          <p className="text-3xl font-semibold text-tremor-content-strong">
            {avgVisitorsPerDay}
          </p>
        </Card>
        <Card className="w-full">
          <p className="flex items-center gap-2.5 text-tremor-default text-tremor-content">
            Visitors today
            <Badge
              percentage={
                (amtVisitorsToday / Number(avgVisitorsPerDay) - 1) * 100
              }
            />
          </p>
          <p className="text-3xl font-semibold text-tremor-content-strong">
            {amtVisitorsToday}
          </p>
        </Card>
      </div>

      <Card className="flex grid-cols-4 flex-col gap-6 sm:grid">
        <h2 className="sm:left-left w-full text-center text-xl font-semibold text-tremor-content-strong">
          This weeks top visitors:
        </h2>
        <div className="col-span-3 flex flex-wrap items-center justify-between gap-8">
          {amtVisitorsToday}
        </div>
      </Card>
    </div>
  );
};

export { AnalyticsDashboard };
