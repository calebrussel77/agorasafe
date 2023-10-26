import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import Link, { type LinkProps } from 'next/link';
import * as React from 'react';

import { Anchor } from '@/components/anchor';

import { cn } from '@/lib/utils';

import { Spinner } from '../spinner';
import { Truncate } from '../truncate';

const buttonVariants = cva(
  'inline-flex items-center gap-1.5 justify-center rounded-md font-medium transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'border border-input hover:bg-gray-100',
        secondary:
          'bg-brand-50 text-secondary-foreground hover:bg-brand-100 border border-brand-100',
        ghost: 'hover:bg-gray-100 hover:text-gray-900 text-gray-900',
        link: 'underline-offset-4 hover:underline text-primary',
      },
      size: {
        default: 'text-sm h-10 py-2 px-4',
        sm: 'text-sm h-9 px-3',
        xs: 'text-sm h-7 px-3',
        lg: 'text-base h-10 px-6 py-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  href?: LinkProps['href'];
  asLink?: LinkProps['as'];
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      children,
      disabled,
      asLink,
      href,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const isDisabled = disabled || isLoading;
    const isGhostOrOutlineVariant =
      variant === 'ghost' || variant === 'outline';

    const btn = (
      <Comp
        className={cn(
          'line-clamp-1',
          buttonVariants({ variant, size, className })
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        <React.Fragment>
          {isLoading && (
            <Spinner
              className={cn(size === 'lg' ? 'h-7 w-7' : 'h-6 w-6')}
              variant={isGhostOrOutlineVariant ? 'ghost' : 'default'}
            />
          )}
          {children}
        </React.Fragment>
      </Comp>
    );

    if (href) {
      return (
        <Anchor href={href} as={asLink}>
          {btn}
        </Anchor>
      );
    }

    return btn;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
