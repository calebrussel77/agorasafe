import { Camera, X } from 'lucide-react';
import NextImage, { type ImageProps } from 'next/future/image';
import React, { type ComponentProps, forwardRef } from 'react';

import { blurDataURL } from '@/utils/image';

import { cn, dataAttr } from '@/lib/utils';

import { useImageOnLoad } from '@/hooks/use-image-on-load';
import { useHover } from '@/hooks/use-react-aria-hover';

import { Spinner } from '../spinner';
import { ImageEmpty } from './image-empty';

export type ImageShape = 'rounded' | 'circle' | 'square';

export const imageShapeClasses: Record<ImageShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-md',
};

const Image = forwardRef<
  HTMLImageElement | null,
  ComponentProps<typeof NextImage> & {
    onRemove?: () => void;
    isLoading?: boolean;
    isHoverable?: boolean;
    hasOverLay?: boolean;
    shape?: ImageShape;
  }
>(
  (
    {
      fill = true,
      className,
      isLoading,
      isHoverable = false,
      hasOverLay = false,
      shape = 'rounded',
      onRemove,
      alt,
      src,
      onClick,
      ...props
    },
    ref
  ) => {
    const { isHovered, hoverProps } = useHover({ isDisabled: false });
    const hasCloseBtn = !!onRemove;
    const { handleImageOnLoad, isLoaded } = useImageOnLoad();
    const shapeClassName = shape ? imageShapeClasses[shape] : undefined;

    return (
      <div
        ref={ref}
        className={cn('relative overflow-hidden', shapeClassName, className)}
      >
        {isHoverable && (
          <div
            onClick={onClick}
            className={cn(
              'default__transition absolute inset-0 z-20 flex items-center justify-center bg-gray-900/50 opacity-0 hover:opacity-100'
            )}
          />
        )}
        {hasOverLay && (
          <div
            onClick={onClick}
            className={cn(
              'default__transition absolute inset-0 z-20 flex items-center justify-center bg-gray-900/50'
            )}
          />
        )}

        {hasCloseBtn && !isLoading && (
          <button
            onClick={onRemove}
            className="absolute right-1 top-1 z-20 rounded-full bg-brand-50 p-1 text-brand-500 shadow-sm hover:text-brand-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {isLoading && (
          <div className="default__transition absolute inset-0 z-20 flex items-center justify-center bg-gray-900/50">
            <Spinner className="z-30" />
          </div>
        )}
        <NextImage
          blurDataURL={blurDataURL()}
          fill={fill}
          onClick={onClick}
          placeholder="blur"
          quality={100}
          {...{
            'data-hover': dataAttr(isHovered),
            'data-loaded': dataAttr(isLoaded),
            onLoad: handleImageOnLoad,
            ...hoverProps,
          }}
          className={cn(
            [
              'flex',
              'object-cover',
              'transition-opacity',
              '!duration-500',
              'opacity-0',
              'bg-gray-50',
              'data-[loaded=true]:opacity-100',
            ],
            className
          )}
          src={src}
          alt={alt}
          {...props}
        />
        {!isLoaded && !hasCloseBtn && (
          <div
            className={cn(
              'absolute inset-0 flex h-full w-full animate-pulse items-center justify-center bg-gray-100',
              shapeClassName
            )}
          >
            <Camera className="h-10 w-10 flex-shrink-0 animate-pulse text-gray-400" />
          </div>
        )}
      </div>
    );
  }
);

export { ImageEmpty, Image, type ImageProps as AgoraImageProps };

Image.displayName = 'Image';
