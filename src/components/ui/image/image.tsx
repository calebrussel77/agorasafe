import { Camera } from 'lucide-react';
import NextImage from 'next/image';
import React, { type ComponentProps, forwardRef, useState } from 'react';

import { blurDataURL } from '@/utils/image';

import { ImageEmpty } from './image-empty';

const Image = forwardRef<
  HTMLImageElement | null,
  ComponentProps<typeof NextImage>
>(({ ...props }, ref) => {
  const [hasError, setHasError] = useState(false);

  return (
    <>
      {!hasError && (
        <NextImage
          ref={ref}
          blurDataURL={blurDataURL()}
          fill
          placeholder="blur"
          onError={() => setHasError(true)}
          {...props}
        />
      )}

      {hasError && (
        <div className="m-auto flex items-center justify-center">
          <Camera className="h-10 w-10 flex-shrink-0 text-gray-400" />
        </div>
      )}
    </>
  );
});

export { ImageEmpty, Image };

Image.displayName = 'Image';
