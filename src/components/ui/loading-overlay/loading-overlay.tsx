import React, { type PropsWithChildren } from 'react';

import { cn } from '@/lib/utils';

import { Spinner } from '../spinner';

interface LoadingOverlayProps {
  className?: string;
  visible: boolean;
  text?: string;
}

const LoadingOverlay = ({
  visible,
  className,
  text,
}: PropsWithChildren<LoadingOverlayProps>) => {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 z-40 flex h-full w-full items-center justify-center bg-white bg-opacity-30 backdrop-blur-sm backdrop-filter transition-all duration-200 ease-in-out',
        className
      )}
    >
      <div className="relative z-20 flex flex-col items-center justify-center gap-y-1">
        <Spinner variant="primary" className="h-12 w-12" />
        {text}
      </div>
    </div>
  );
};

export { LoadingOverlay };
