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
>(({ className = 'w-9 h-9', variant = 'default', ...rest }, ref) => {
  const classNameVariants = SpinnerClasses[variant];

  return (
    <div
      ref={ref}
      className={cn('loader', classNameVariants, className)}
      {...rest}
    />
  );
});

Spinner.displayName = 'Spinner';

const FullSpinner = () => {
  return (
    <div className="fixed inset-0 z-40 flex h-full w-full items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm backdrop-filter transition-all duration-200 ease-in-out">
      <Spinner className="relative z-20 h-12 w-12" />
    </div>
  );
};

export { Spinner, FullSpinner };
