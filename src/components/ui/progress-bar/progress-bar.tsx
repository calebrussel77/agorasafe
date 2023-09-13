import * as ProgressPrimitive from '@radix-ui/react-progress';
import React from 'react';

import { cn } from '@/lib/utils';

type ClassNames = {
  root?: string;
  progressIndicator?: string;
};

interface ProgressBarProps {
  progress: number;
  className?: string;
  classNames?: Partial<ClassNames>;
}

const ProgressBar = ({ progress, className, classNames }: ProgressBarProps) => {
  // useEffect(() => {
  //   let timerId: null | NodeJS.Timer = null;

  //   timerId = setInterval(() => {
  //     const p = Math.ceil(getRandomArbitrary(0, 100) / 10) * 10;
  //     setProgress(p);
  //   }, 5000);

  //   return () => {
  //     if (timerId) {
  //       clearInterval(timerId);
  //     }
  //   };
  // }, []);

  return (
    <ProgressPrimitive.Root
      value={progress}
      className={cn(
        'h-2 w-full overflow-hidden bg-gray-100',
        className,
        classNames?.root
      )}
    >
      <ProgressPrimitive.Indicator
        style={{ width: `${progress}%` }}
        className={cn(
          'h-full bg-brand-600 duration-300 ease-in-out',
          classNames?.progressIndicator
        )}
      />
    </ProgressPrimitive.Root>
  );
};

export { ProgressBar };
