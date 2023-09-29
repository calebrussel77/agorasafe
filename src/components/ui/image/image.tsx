import { Camera, X } from 'lucide-react';
import NextImage from 'next/image';
import React, { type ComponentProps, forwardRef } from 'react';

import { blurDataURL } from '@/utils/image';

import { cn, dataAttr } from '@/lib/utils';

import { useImageOnLoad } from '@/hooks/use-image-on-load';
import { useHover } from '@/hooks/use-react-aria-hover';

import { Spinner } from '../spinner';
import { ImageEmpty } from './image-empty';

const Image = forwardRef<
  HTMLImageElement | null,
  ComponentProps<typeof NextImage> & {
    onRemove?: () => void;
    isLoading?: boolean;
    isHoverable?: boolean;
  }
>(
  (
    {
      fill = true,
      className,
      isLoading,
      isHoverable = false,
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

    return (
      <>
        <div className={cn('relative overflow-hidden', className)}>
          {isHoverable && (
            <div
              onClick={onClick}
              className="default__transition absolute inset-0 z-20 flex items-center justify-center bg-gray-900/50 opacity-0 hover:opacity-100"
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
            ref={ref}
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
                'data-[loaded=true]:opacity-100',
              ],
              className
            )}
            src={src}
            alt={alt}
            {...props}
          />
        </div>

        {!isLoaded && !hasCloseBtn && (
          <div className="absolute inset-0 flex h-full w-full items-center justify-center">
            <Camera className="h-10 w-10 flex-shrink-0 animate-pulse text-gray-400" />
          </div>
        )}
      </>
    );
  }
);

export { ImageEmpty, Image };

Image.displayName = 'Image';
