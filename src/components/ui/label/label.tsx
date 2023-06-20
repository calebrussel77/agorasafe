import * as LabelPrimitive from '@radix-ui/react-label';
import { type VariantProps, cva } from 'class-variance-authority';
import { Lock } from 'lucide-react';
import * as React from 'react';
import { useCss } from 'react-use';

import { VariantIcon } from '@/utils/variant-icons';
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
      checkableField,
      children,
      disabled,
      disabledIcon,
      icon,
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

    const afterClassName = useCss({
      '*:not(:last-child)': {
        marginRight: '6px',
      },
    });

    return (
      <LabelPrimitive.Root
        ref={ref}
        className={cn(
          required &&
            "after:content-['*'] after:text-red-500 after:font-bold after:ml-1",
          variant && getVariantColor(variant),
          afterClassName,
          className
        )}
        {...props}
      >
        <>
          {!checkableField && (
            <VariantIcon icon={icon} size="sm" variant={variant} />
          )}
          {disabled && withDisabledIcon && (
            <div className="inline-flex mr-1">
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
