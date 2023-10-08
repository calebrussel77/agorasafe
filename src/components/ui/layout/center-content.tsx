import { type FC } from 'react';

import { cn } from '@/lib/utils';

type CenterContentProps = React.HTMLProps<HTMLDivElement>;

const CenterContent: FC<CenterContentProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'mx-auto flex h-full w-full max-w-2xl flex-1 flex-col items-center justify-center p-2 md:p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { CenterContent };
