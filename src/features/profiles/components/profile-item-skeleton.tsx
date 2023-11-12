import React, { type FC } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

interface ProfileItemSkeletonProps {
  className?: string;
}

const ProfileItemSkeleton: FC<ProfileItemSkeletonProps> = ({}) => {
  return (
    <div className="flex w-full max-w-sm flex-col items-center">
      <Skeleton className="aspect-square h-20 rounded-full sm:h-24" />
      <Skeleton className="mt-3 aspect-square h-5 w-full max-w-xs" />
      <Skeleton className="mt-2 aspect-square h-5 w-1/2" />
    </div>
  );
};

export { ProfileItemSkeleton };
