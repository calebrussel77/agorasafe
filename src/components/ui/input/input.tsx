import * as React from 'react';

import { type Variant, getVariantBorderColor } from '@/utils/variants';

import { cn } from '@/lib/utils';

import { useFocus } from '@/hooks/use-focus';
import { useMergeRefs } from '@/hooks/use-merge-refs';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  setParentValue?: (value: string) => void;
  loading?: boolean;
  variant?: Variant;
  autoFocus?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, autoFocus, variant, ...props }, ref) => {
    const { elementRef } = useFocus(autoFocus);
    const refs = useMergeRefs(elementRef, ref);
    const hasError = variant === 'danger';

    return (
      <input
        style={hasError ? { borderColor: 'red' } : {}}
        aria-invalid={hasError ? 'true' : 'false'}
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          variant && getVariantBorderColor(variant),
          className
        )}
        ref={refs}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
