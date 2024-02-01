import { type FC } from 'react';

import { cn } from '@/lib/utils';

export type AbsolutePlacementProps = React.HTMLProps<HTMLDivElement> & {
  placement?: keyof typeof placementMap;
};

const placementMap = {
  'top-left': 'top-2 left-2 transform -translate-x-1/4 -translate-y-1/4',
  'top-right': 'top-2 right-2 transform translate-x-1/4 -translate-y-1/4',
  'bottom-left': 'bottom-2 left-2 transform -translate-x-1/4 -translate-y-1/4',
  'bottom-right': 'bottom-2 right-2 translate-x-1/4 translate-y-1/4',
  'center-center': 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
  'bottom-center': 'left-1/2 bottom-2 -translate-x-1/2 -translate-y-1/2',
  'top-center': 'left-1/2 top-2 -translate-x-1/2 -translate-y-1/2',
} as const;

const AbsolutePlacement: FC<AbsolutePlacementProps> = ({
  className,
  children,
  placement = 'center-center',
  ...props
}) => {
  return (
    <div
      className={cn('absolute', placementMap[placement], className)}
      {...props}
    >
      {children}
    </div>
  );
};

export { AbsolutePlacement };
