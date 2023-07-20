import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const VARIANTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-4xl md:text-6xl font-bold tracking-tight',
      h2: 'text-2xl font-bold leading-none tracking-tight',
      h3: 'text-xl font-semibold leading-none tracking-tight',
      h4: 'text-lg font-semibold',
      h5: 'text-lg font-semibold leading-snug',
      paragraph: 'text-base',
      subtle: 'text-base leading-7 text-gray-600',
      small: 'text-sm text-gray-600 leading-6',
    },
  },
  defaultVariants: {
    variant: 'paragraph',
  },
});

type ComponentWithProps<T> = T extends React.ComponentType<infer P>
  ? P
  : object;

type TypographyProps<
  T extends keyof JSX.IntrinsicElements | React.ComponentType<any>
> = {
  as?: T;
  className?: string;
  truncate?: boolean;
  children?: React.ReactNode;
} & VariantProps<typeof typographyVariants> &
  ComponentWithProps<T>;

const Typography = React.forwardRef<HTMLElement, TypographyProps<any>>(
  ({ className, variant, truncate = false, as: As = 'p', ...props }, ref) => {
    const Component = As as
      | keyof JSX.IntrinsicElements
      | React.ComponentType<any>;

    const hasAssociatedVariant = VARIANTS.includes(As as (typeof VARIANTS)[0]);

    const newVariant = hasAssociatedVariant
      ? (As as typeof variant)
      : 'paragraph';

    return (
      <Component
        className={cn(
          truncate && 'max-w-md truncate whitespace-nowrap break-words',
          typographyVariants({ variant: variant || newVariant, className })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Typography.displayName = 'Typography';

export { Typography };
