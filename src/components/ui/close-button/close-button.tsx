import { type VariantProps, cva } from 'class-variance-authority';
import React, { forwardRef } from 'react';

import { cn } from '@/lib/utils';

const closeButtonToken = cva(['p-1 text-white'], {
  variants: {
    variant: {
      transparent: 'rounded-full hover:bg-gray-50',
      subtle: 'bg-transparent',
    },
  },
  compoundVariants: [{ variant: 'subtle' }],
  defaultVariants: {
    variant: 'subtle',
  },
});

export type CloseButtonGlobalProps = VariantProps<typeof closeButtonToken> &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export const CloseButton = forwardRef<
  HTMLButtonElement,
  CloseButtonGlobalProps
>(({ className, variant, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={closeButtonToken({
        variant,
        class: cn(className),
      })}
      {...props}
    />
  );
});

CloseButton.displayName = 'CloseButton';
