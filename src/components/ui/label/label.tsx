import * as LabelPrimitive from '@radix-ui/react-label';
import { type VariantProps, cva } from 'class-variance-authority';
import { Lock } from 'lucide-react';
import * as React from 'react';

import { type Variant, getVariantColor } from '@/utils/variants';
import { wrapChildren } from '@/utils/wrap-children';

import { cn } from '@/lib/utils';

export interface LabelOptions {
  checkableField?: boolean;
  disabled?: boolean;
  disabledIcon?: JSX.Element;
  icon?: JSX.Element;
  variant?: Variant;
  required?: boolean;
  withDisabledIcon?: boolean;
  htmlFor?: string;
}

const labelVariants = cva(
  'relative flex flex-shrink-0 max-w-full items-center select-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> &
    LabelOptions
>(
  (
    {
      children,
      disabled,
      disabledIcon,
      variant,
      withDisabledIcon = true,
      className,
      required,
      ...props
    },
    ref
  ) => {
    // Wrap strings in span to allow for required asterisk
    const content = wrapChildren(children as JSX.Element);

    return (
      <LabelPrimitive.Root
        ref={ref}
        className={cn(
          required &&
            "after:ml-1 after:font-bold after:text-red-500 after:content-['*']",
          variant && getVariantColor(variant),
          className
        )}
        {...props}
      >
        <>
          {disabled && withDisabledIcon && (
            <div className="mr-1 inline-flex">
              {disabledIcon || <Lock className="h-4 w-4" />}
            </div>
          )}
          {content}
        </>
      </LabelPrimitive.Root>
    );
  }
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
