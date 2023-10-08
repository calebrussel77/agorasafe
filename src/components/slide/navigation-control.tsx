import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { type FC, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ClassNames = {
  root?: string;
  icon?: string;
};

interface NavigationControlProps
  extends React.ComponentPropsWithoutRef<'button'> {
  children?: ReactNode;
  className?: string;
  classNames?: ClassNames;
  position?: 'left' | 'right';
}

const IconMapPosition = {
  left: ArrowLeft,
  right: ArrowRight,
};
const NavigationControl: FC<NavigationControlProps> = ({
  className,
  classNames,
  children,
  position = 'left',
  ...rest
}) => {
  const Icon = IconMapPosition[position];
  const positionClassName = cn(
    'absolute top-1/2 h-8 w-8 rounded-full shadow-md flex justify-center items-center flex-shrink-0 border border-brand-600 bg-white text-brand-500 transition hover:bg-zinc-100',
    {
      'left-0': position === 'left',
      'right-0': position === 'right',
    }
  );

  return (
    <button
      className={cn(positionClassName, className, classNames?.root)}
      {...rest}
    >
      {children || <Icon className={cn('h-5 w-5', classNames?.icon)} />}
    </button>
  );
};

export { NavigationControl };
