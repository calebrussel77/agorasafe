import React, { type FC } from 'react';

import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { Typography } from '@/components/ui/typography';
import { User } from '@/components/user';

import { dateToReadableString } from '@/lib/date-fns';
import { cn } from '@/lib/utils';

import { type GetAllServiceRequestsOutput } from '../types';

interface ServiceRequestCardProps {
  className?: string;
  serviceRequest: GetAllServiceRequestsOutput['serviceRequests'][number];
}

const ServiceRequestCard: FC<ServiceRequestCardProps> = ({
  serviceRequest,
  className,
}) => {
  return (
    <article
      className={cn('flex flex-col items-start justify-between', className)}
    >
      <div className="relative w-full">
        <Image
          src={serviceRequest?.photos[0]?.url as string}
          alt={serviceRequest?.photos[0]?.name as string}
          className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
        />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
      </div>
      <div className="max-w-xl">
        <div className="mt-8 flex items-center gap-x-4 text-xs">
          <time
            dateTime={serviceRequest?.createdAt.toString()}
            className="text-gray-500"
          >
            {dateToReadableString(serviceRequest?.createdAt)}
          </time>
          <a
            href={`/service-requests?category=${serviceRequest?.service?.categoryService?.slug}`}
          >
            <Badge content={serviceRequest?.service?.categoryService?.name} />
          </a>
        </div>
        <div className="group relative">
          <Typography
            as="h3"
            truncate
            lines={2}
            className="mt-3 group-hover:text-gray-600"
          >
            <a href={`/service-requests/${serviceRequest?.slug}`}>
              <span className="absolute inset-0" />
              {serviceRequest?.title}
            </a>
          </Typography>
          <Typography
            truncate
            className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600"
          >
            {serviceRequest?.description}
          </Typography>
        </div>
        <div className="relative mt-8 flex items-center gap-x-4">
          <User
            profile={serviceRequest?.author?.profile}
            withProfileTypeInitial
            avatarProps={{ size: 'sm' }}
          />
        </div>
      </div>
    </article>
  );
};

export { ServiceRequestCard };
