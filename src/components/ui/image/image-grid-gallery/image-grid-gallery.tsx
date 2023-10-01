import React, { type FC } from 'react';
import { Gallery, Item } from 'react-photoswipe-gallery';

import { cn } from '@/lib/utils';

import { Image } from '../image';

type ClassNames = {
  root?: string;
  image?: string;
};

interface ImageGridGalleryClientProps {
  className?: string;
  classNames?: Partial<ClassNames>;
  images: Array<{ name: string; url: string }>;
}

const ImageGridGalleryClient: FC<ImageGridGalleryClientProps> = ({
  images,
  className,
  classNames,
}) => {
  const imagesCount = images?.length;

  return (
    <Gallery>
      <div
        className={cn(
          'relative h-64 w-full overflow-hidden rounded-lg bg-gray-100',
          imagesCount === 1 && 'grid grid-cols-1',
          imagesCount === 2 && 'grid grid-cols-2 gap-4',
          imagesCount === 3 && 'grid grid-flow-col grid-rows-4 gap-4',
          className || classNames?.root
        )}
      >
        {images?.map((photo, idx) => (
          <Item
            key={photo?.name}
            original={photo?.url}
            alt={photo?.name}
            width="1600"
            height="1100"
          >
            {({ ref, open }) => (
              <Image
                ref={ref as React.MutableRefObject<HTMLImageElement>}
                src={photo?.url}
                onClick={open}
                alt={photo?.name}
                isHoverable
                className={cn(
                  'max-h-full w-full cursor-pointer rounded-lg object-cover shadow-sm',
                  imagesCount === 3 && idx === 0 && 'row-span-4',
                  imagesCount === 3 && idx > 0 && 'col-span-2 row-span-2',
                  classNames?.image
                )}
              />
            )}
          </Item>
        ))}
      </div>
    </Gallery>
  );
};

export { ImageGridGalleryClient };
