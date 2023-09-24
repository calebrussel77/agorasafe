import { Camera } from 'lucide-react';
import { type ComponentProps, type FC, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ImageEmptyProps = ComponentProps<'div'> & {
  className?: string;
  children?: ReactNode;
};

const ImageEmpty: FC<ImageEmptyProps> = ({ className, children, ...rest }) => {
  return (
    <div
      className={cn(
        'flex justify-center rounded-md border border-dashed border-gray-300 px-14 py-16 text-gray-600',
        className
      )}
      {...rest}
    >
      {children ? (
        children
      ) : (
        <Camera className="m-auto h-10 w-10 flex-shrink-0" />
      )}
    </div>
  );
};

export { ImageEmpty };
