import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Typography } from '../typography';

/**
 * Usage of the component 
 *  <Badge content="99+" variant="danger" size="xs" placement="top-right">
          <Avatar
            size="lg"
            src="https://i.pravatar.cc/300?u=a042581f4e29026704f"
          />
        </Badge>
 */
const badgeVariants = cva(
  'inline-flex items-center text-xs border transition duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      size: {
        xs: 'px-1.5',
        sm: 'px-1.5 font-semibold',
        md: 'px-2 font-semibold',
        lg: 'px-2.5 text-base font-semibold',
      },
      maxWidth: {
        xxs: 'max-w-[250px]',
        xs: 'max-w-xs',
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
      },
      shape: {
        rounded: 'rounded-md',
        square: 'rounded-none',
        circle: 'rounded-full',
      },
      variant: {
        default:
          'bg-gray-200 hover:bg-gray-200/80 border-transparent text-gray-600',
        primary:
          'bg-primary hover:bg-primary/80 border-transparent text-primary-foreground',
        danger: 'bg-red-600 hover:bg-red-600/80 border-transparent text-white',
        warning:
          'bg-yellow-600 hover:bg-yellow-600/80 border-transparent text-white',
        success:
          'bg-green-600 hover:bg-green-600/80 border-transparent text-white',
        outline: 'text-brand-700 border-brand-600 bg-brand-100',
      },
      placement: {
        'top-left': 'top-0 -left-0 transform -translate-x-1/4 -translate-y-1/4',
        'top-right':
          'top-0 -right-0 transform translate-x-1/4 -translate-y-1/4',
        'bottom-left':
          'bottom-0 left-0 transform -translate-x-1/4 -translate-y-1/4',
        'bottom-right': '-bottom-1 -right-1 translate-x-1/4 translate-y-1/4',
      },
    },
    defaultVariants: {
      variant: 'default',
      maxWidth: 'xxs',
      shape: 'circle',
    },
  }
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'>,
    VariantProps<typeof badgeVariants> {
  content: React.ReactNode;
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  shouldDisableOutline?: boolean;
  truncate?: boolean;
}

function Badge({
  className,
  children,
  content,
  variant,
  shouldDisableOutline,
  truncate = false,
  maxWidth = 'xxs',
  shape,
  size = 'md',
  placement = 'bottom-right',
  as = 'div',
  ...props
}: BadgeProps) {
  const Comp = as;

  return (
    <Comp className="relative w-fit">
      {children}
      {content ? (
        <div
          className={cn(
            badgeVariants({
              variant,
              placement: children ? placement : null,
              size,
              shape,
              maxWidth,
              class:
                placement &&
                children &&
                'absolute z-10 flex items-center justify-center',
            }),
            !shouldDisableOutline && 'border-2 border-white',
            content === '' && 'h-3 w-3 p-0',
            className
          )}
          {...props}
        >
          {truncate ? (
            <Typography
              as="p"
              className={cn('whitespace-normal text-xs')}
              hasEllipsisText={false}
              truncate={truncate}
              isTooltipDisabled={false}
            >
              {content}
            </Typography>
          ) : (
            content
          )}
        </div>
      ) : null}
    </Comp>
  );
}

export { Badge, badgeVariants };
