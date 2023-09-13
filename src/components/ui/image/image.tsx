import { Camera } from 'lucide-react';
import NextImage from 'next/image';
import React, { type ComponentProps, forwardRef } from 'react';

import { blurDataURL } from '@/utils/image';

import { cn, dataAttr } from '@/lib/utils';

import { useImageOnLoad } from '@/hooks/use-image-on-load';
import { useHover } from '@/hooks/use-react-aria-hover';

import { ImageEmpty } from './image-empty';

const Image = forwardRef<
  HTMLImageElement | null,
  ComponentProps<typeof NextImage>
>(({ fill = true, className, alt, src, ...props }, ref) => {
  const { isHovered, hoverProps } = useHover({ isDisabled: false });
  const { handleImageOnLoad, isLoaded } = useImageOnLoad();

  return (
    <>
      <NextImage
        ref={ref}
        blurDataURL={blurDataURL()}
        fill={fill}
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
            'w-full',
            'h-full',
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

      {!isLoaded && (
        <div className="m-auto flex h-full w-full items-center justify-center align-middle">
          <Camera className="h-10 w-10 flex-shrink-0 animate-pulse text-gray-400" />
        </div>
      )}
    </>
  );
});

export { ImageEmpty, Image };

Image.displayName = 'Image';
