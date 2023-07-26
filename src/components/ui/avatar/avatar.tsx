/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import NextImage from 'next/image';
import * as React from 'react';

import { blurDataURL } from '@/utils/image';

import { cn } from '@/lib/utils';

import defaultAvatarIcon from '@public/images/avatar.svg';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type AvatarComponentOptions = {
  //The size of the avatar already predefine
  size?: AvatarSize;

  //The shape
  shape?: 'rounded' | 'circle' | 'square';

  //if he avatar has border
  bordered?: boolean;

  fallBack?: React.ReactNode | JSX.Element;
};

export const avatarSizeClasses = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
  xxl: 'h-24 w-24',
};

export const avatarShapeClasses = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-md',
};

const AvatarComponent = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn('relative flex shrink-0 overflow-hidden', className)}
      {...props}
    />
  );
});

AvatarComponent.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, src, alt, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('h-full w-full object-cover object-center', className)}
    asChild
    alt={alt}
    src={src}
    {...props}
  >
    <NextImage
      alt={alt as string}
      src={src as string}
      fill
      blurDataURL={blurDataURL()}
      placeholder="blur"
    />
  </AvatarPrimitive.Image>
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center bg-muted font-semibold uppercase',
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export type AvatarProps = React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Image
> &
  AvatarComponentOptions;

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  AvatarProps
>(
  (
    {
      className,
      bordered,
      children,
      size = 'sm',
      shape = 'circle',
      alt,
      ...props
    },
    ref
  ) => {
    const avatarSizeClassName = size ? avatarSizeClasses[size] : undefined;
    const shapeClassName = shape ? avatarShapeClasses[shape] : undefined;

    return (
      <AvatarComponent
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden',
          bordered && 'ring-2 ring-gray-300 ',
          avatarSizeClassName,
          shapeClassName,
          className
        )}
      >
        <AvatarImage alt={alt} {...props} />
        <AvatarFallback
          className={cn(
            bordered && 'ring-2 ring-gray-300 ',
            avatarSizeClassName,
            shapeClassName,
            className
          )}
        >
          {children ? (
            children
          ) : (
            <NextImage
              priority
              alt={alt || 'default avatar'}
              src={defaultAvatarIcon}
            />
          )}
        </AvatarFallback>
      </AvatarComponent>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };
