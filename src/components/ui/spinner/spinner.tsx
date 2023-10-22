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
      className={cn('loader', variantClassNames, sizeClassNames, className)}
      {...rest}
    />
  );
});

Spinner.displayName = 'Spinner';

const FullSpinner = ({ loadingText }: { loadingText?: string }) => {
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
