/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import NextImage from 'next/future/image';
import * as React from 'react';

import { blurDataURL } from '@/utils/image';

import { cn, dataAttr } from '@/lib/utils';

import { useImageOnLoad } from '@/hooks/use-image-on-load';
import { useHover } from '@/hooks/use-react-aria-hover';

import defaultAvatarIcon from '@public/images/avatar.svg';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type AvatarColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger';

export type AvatarComponentOptions = {
  //The size of the avatar already predefine
  size?: AvatarSize;

  //Enable disbling of the avatar
  isDisabled?: boolean;

  //The color of the avatar already predefine
  color?: AvatarColor;

  //The shape
  shape?: 'rounded' | 'circle' | 'square';

  //if he avatar has border
  isBordered?: boolean;

  fill?: boolean;

  fallBack?: React.ReactNode | JSX.Element;
};

export const avatarSizeClasses: Record<AvatarSize, string> = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
  xxl: 'h-24 w-24',
};

export const avatarColorClasses: Record<AvatarColor, string> = {
  default: 'ring-zinc-200',
  primary: 'ring-brand-500',
  secondary: 'ring-pink-500',
  success: 'ring-green-500',
  danger: 'ring-red-500',
  warning: 'ring-yellow-500',
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
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image> & {
    fill?: boolean;
  }
>(({ className, src, alt, fill, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn(
      [
        'flex',
        'object-cover',
        'w-full',
        'h-full',
        'transition-opacity',
        '!duration-500',
        'opacity-0',
        'data-[loaded=true]:opacity-100',
      ],
      className
    )}
    asChild
    alt={alt}
    src={src}
    {...props}
  >
    <NextImage
      alt={alt as string}
      src={src as string}
      fill={fill}
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
      isBordered,
      children,
      size = 'sm',
      shape = 'circle',
      isDisabled,
      onClick,
      color,
      alt,
      src,
      fill = true,
      ...props
    },
    ref
  ) => {
    const avatarSizeClassName = size ? avatarSizeClasses[size] : undefined;
    const shapeClassName = shape ? avatarShapeClasses[shape] : undefined;
    const colorClassName =
      color && isBordered ? avatarColorClasses[color] : undefined;

    const { isHovered, hoverProps } = useHover({ isDisabled });
    const { handleImageOnLoad, isLoaded } = useImageOnLoad();

    const avatarClassName = cn(
      'relative box-border align-middle justify-center flex shrink-0 overflow-hidden',
      isBordered && `ring ring-offset-[2px] ${avatarColorClasses['default']}`,
      avatarSizeClassName,
      shapeClassName,
      colorClassName,
      className,
      isDisabled && 'pointer-events-none opacity-50'
    );

    return (
      <AvatarComponent
        ref={ref}
        {...{ 'data-hover': dataAttr(isHovered), ...hoverProps }}
        className={avatarClassName}
        onClick={onClick}
      >
        <AvatarImage
          alt={alt}
          src={src}
          fill={fill}
          {...props}
          {...{ 'data-loaded': dataAttr(isLoaded), onLoad: handleImageOnLoad }}
        />
        <AvatarFallback className={avatarClassName}>
          {children ? (
            children
          ) : (
            <NextImage
              priority
              fill={fill}
              alt={alt || 'default avatar'}
              src={defaultAvatarIcon}
              className="data-[loaded=true]:animate-pulse"
            />
          )}
        </AvatarFallback>
      </AvatarComponent>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };
