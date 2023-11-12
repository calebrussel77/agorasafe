import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

import { AbsolutePlacement } from '../layout';

const spinnerClasses = {
  default: 'border-l-white',
  primary: 'border-l-brand-500',
  ghost: 'border-l-gray-600',
};

const sizeClasses = {
  sm: 'h-7 w-7',
  md: 'h-9 w-9',
  lg: 'h-12 w-12',
};

const Spinner = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    variant?: keyof typeof spinnerClasses;
    size?: keyof typeof sizeClasses;
  }
>(({ className, variant = 'default', size = 'md', ...rest }, ref) => {
  const variantClassNames = spinnerClasses[variant];
  const sizeClassNames = sizeClasses[size];

  return (
    <div
      ref={ref}
      className={cn(
        'spinner-loader',
        variantClassNames,
        sizeClassNames,
        className
      )}
      {...rest}
    />
  );
});

Spinner.displayName = 'Spinner';

const FullSpinner = ({
  loadingText,
  isFullPage = false,
}: {
  loadingText?: string;
  isFullPage?: boolean;
}) => {
  if (isFullPage) {
    return (
      <div className="fixed inset-0 z-40 flex h-full w-full items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm backdrop-filter transition-all duration-200 ease-in-out">
        <div className="relative z-20 flex flex-col items-center justify-center gap-y-1">
          <Spinner variant="primary" className="h-16 w-16" />
          {loadingText}
        </div>
      </div>
    );
  }

  return (
    <AbsolutePlacement
      placement="center-center"
      className="bg-white bg-opacity-70 backdrop-blur-sm backdrop-filter"
    >
      <div className="flex flex-col items-center justify-center gap-y-1">
        <Spinner variant="primary" className="h-16 w-16" />
        {loadingText}
      </div>
    </AbsolutePlacement>
  );
};

export { Spinner, FullSpinner };
