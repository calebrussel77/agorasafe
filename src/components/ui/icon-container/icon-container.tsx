import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Usage of the component 
 *  <IconContainer content="99+" variant="danger" size="xs" placement="top-right">
          <Avatar
            size="lg"
            src="https://i.pravatar.cc/300?u=a042581f4e29026704f"
          />
        </IconContainer>
 */
const iconContainerVariants = cva('', {
  variants: {
    shape: {
      square: 'rounded-none',
      rounded: 'rounded-md',
      circle: 'rounded-full',
    },
    size: {
      xs: 'p-1',
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-2.5',
    },
    variant: {
      primary: 'bg-brand-50 text-brand-600',
      ghost: 'bg-gray-50 text-gray-600',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export interface IconContainerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'>,
    VariantProps<typeof iconContainerVariants> {}

function IconContainer({
  className,
  children,
  variant,
  shape = 'circle',
  size = 'md',
  ...props
}: IconContainerProps) {
  return (
    <div
      className={cn(
        iconContainerVariants({
          variant,
          shape,
          size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { IconContainer, iconContainerVariants };
