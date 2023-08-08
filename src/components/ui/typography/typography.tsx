import { type ComponentWithProps } from '@/types';
import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Tooltip } from '../tooltip';
import { Truncate, type TruncateProps } from '../truncate';

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
      small: 'text-sm text-gray-500 leading-5',
    },
  },
  defaultVariants: {
    variant: 'paragraph',
  },
});

type TruncatedTypography = {
  truncate?: true;
  isTooltipDisabled?: boolean;
} & TruncateProps;

type ExpandedTypography = {
  truncate?: false;
};

type SizeVariant = TruncatedTypography | ExpandedTypography;

type TypographyProps<
  T extends keyof JSX.IntrinsicElements | React.ComponentType<any>
> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & VariantProps<typeof typographyVariants> &
  ComponentWithProps<T>;

const Typography = React.forwardRef<
  HTMLElement,
  TypographyProps<any> & SizeVariant
>(
  (
    { className, variant, truncate = false, children, as: As = 'p', ...rest },
    ref
  ) => {
    const [hasTooltip, setHasTooltip] = React.useState(false);

    const Component = As as
      | keyof JSX.IntrinsicElements
      | React.ComponentType<any>;

    const hasAssociatedVariant = VARIANTS.includes(As as (typeof VARIANTS)[0]);

    const newVariant = hasAssociatedVariant
      ? (As as typeof variant)
      : 'paragraph';

    const renderChildren = () => {
      if (truncate) {
        const truncateProps = rest as TruncatedTypography;
        const {
          hasEllipsisText,
          renderEllipsis,
          shouldDefaultTruncate,
          lines,
          onTruncate,
          tokenize,
          isTooltipDisabled = false,
          ...otherProps
        } = truncateProps;

        const onTruncateHandler = (wasTruncated: boolean) => {
          setHasTooltip(wasTruncated);
          onTruncate && onTruncate(wasTruncated);
        };

        const truncatedContent = (
          <Truncate
            {...{
              className: cn(
                typographyVariants({
                  variant: variant || newVariant,
                  className,
                })
              ),
              hasEllipsisText,
              renderEllipsis,
              shouldDefaultTruncate,
              lines,
              onTruncate: onTruncateHandler,
              tokenize,
            }}
          >
            {children}
          </Truncate>
        );

        return !isTooltipDisabled && hasTooltip ? (
          <Tooltip>
            <Tooltip.Trigger asChild>
              <Component ref={ref} className="cursor-default" {...otherProps}>
                {truncatedContent}
              </Component>
            </Tooltip.Trigger>
            <Tooltip.Content
              side="bottom"
              hasArrow
              className="text-xs leading-6"
            >
              {children}
            </Tooltip.Content>
          </Tooltip>
        ) : (
          <Component ref={ref} {...otherProps}>
            {truncatedContent}
          </Component>
        );
      }
      return (
        <Component
          ref={ref}
          className={cn(
            typographyVariants({
              variant: variant || newVariant,
              className,
            })
          )}
          {...rest}
        >
          {children}
        </Component>
      );
    };

    return renderChildren();
  }
);

Typography.displayName = 'Typography';

export { Typography };
