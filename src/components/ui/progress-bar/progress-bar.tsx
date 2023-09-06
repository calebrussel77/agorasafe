import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ className, progress }) => {
  //   const [progress, setProgress] = useState(0);

  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       setProgress(prevProgress => {
  //         if (prevProgress < 100) {
  //           return prevProgress + 1;
  //         } else {
  //           clearInterval(interval);
  //           return 100;
  //         }
  //       });
  //     }, duration / 100);

  //     return () => {
  //       clearInterval(interval);
  //     };
  //   }, [duration]);

  return (
    <div
      className={cn(
        'relative h-2 w-2/3 rounded-full bg-gray-300 shadow-lg',
        className
      )}
    >
      <div
        className="absolute left-0 top-0 h-full rounded-full bg-brand-600 transition-all ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export { ProgressBar };
