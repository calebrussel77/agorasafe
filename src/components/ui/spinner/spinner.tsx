import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

import { AbsolutePlacement } from '../layout';

const SpinnerClasses = {
  default: 'border-l-white',
  primary: 'border-l-brand-500',
  ghost: 'border-l-gray-600',
};

const Spinner = forwardRef<
  HTMLDivElement,
  { className?: string; variant?: keyof typeof SpinnerClasses }
>(({ className, variant = 'default', ...rest }, ref) => {
  const classNameVariants = SpinnerClasses[variant];

  return (
    <div
      ref={ref}
      className={cn('loader h-9 w-9', classNameVariants, className)}
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
