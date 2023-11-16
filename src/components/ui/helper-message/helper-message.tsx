import { type VariantProps, cva } from 'class-variance-authority';
import React, { type ReactNode, forwardRef } from 'react';

import { cn } from '@/lib/utils';

const helperMessageToken = cva(
  ['whitespace-normal tracking-wide text-gray-400'],
  {
    variants: {
      size: {
        sm: ['text-xs'],
        md: ['text-xs'],
        lg: ['text-sm'],
        xl: ['text-md'],
      },
    },
    compoundVariants: [{ size: 'md' }],
    defaultVariants: {
      size: 'md',
    },
  }
);

export type HelperMessageGlobalProps = VariantProps<
  typeof helperMessageToken
> & { className?: string; children: ReactNode };

export const HelperMessage = forwardRef<
  HTMLDivElement,
  HelperMessageGlobalProps
>(({ children, className, size, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        helperMessageToken({
          size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

HelperMessage.displayName = 'HelperMessage';
