import { Camera } from 'lucide-react';
import { type ComponentProps, type FC, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type TImageEmptyProps = ComponentProps<'button'> & {
  className?: string;
  isInteractive?: boolean;
  children?: ReactNode;
};
const ImageEmpty: FC<TImageEmptyProps> = ({
  isInteractive,
  className,
  children,
  ...rest
}) => {
  return (
    <button
      type="button"
      disabled={!isInteractive}
      className={cn(
        'border border-dashed border-gray-300 text-gray-600 rounded-md flex justify-center disabled:bg-gray-200 disabled:cursor-not-allowed hover:bg-gray-100 py-16 px-14 transition duration-300',
        className
      )}
      {...rest}
    >
      {children ? (
        children
      ) : (
        <Camera className="flex-shrink-0 h-10 w-10 m-auto" />
      )}
    </button>
  );
};

export { ImageEmpty };
