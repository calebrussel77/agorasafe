import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

const SpinnerClasses = {
  default: 'border-l-white',
  primary: 'border-l-brand-500',
  secondary: 'border-l-purple-500',
};

const Spinner = forwardRef<
  HTMLDivElement,
  { className?: string; variant?: 'default' | 'primary' | 'secondary' }
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

const FullSpinner = ({
  loadingText = 'Chargement...',
}: {
  loadingText?: string;
}) => {
  return (
    <div className="fixed inset-0 z-40 flex h-full w-full items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm backdrop-filter transition-all duration-200 ease-in-out">
      <div className="relative z-20 flex flex-col items-center justify-center gap-y-1">
        <Spinner variant="primary" className="h-16 w-16" />
        {loadingText}
      </div>
    </div>
  );
};

export { Spinner, FullSpinner };
