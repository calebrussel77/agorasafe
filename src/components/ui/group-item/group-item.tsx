import React, { type FC, type ReactElement, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface GroupItemProps {
  title: ReactElement;
  children?: ReactNode;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  iconBefore?: ReactElement;
  iconAfter?: ReactElement;
}

const GroupItem: FC<GroupItemProps> = ({
  className,
  children,
  title,
  iconAfter,
  iconBefore,
  descriptionClassName,
  titleClassName,
}) => {
  const isTitleString = typeof title === 'string';
  const isChildrenString = typeof children === 'string';
  return (
    <div
      className={cn(
        '-mx-3 flex items-center rounded-md px-3 py-2 hover:bg-gray-100',
        className
      )}
    >
      {iconBefore}
      <div
        className={cn(
          'flex flex-col items-start justify-start',
          iconBefore && !iconAfter && 'ml-2 w-full flex-1 gap-0.5'
        )}
      >
        {isTitleString ? (
          <h3
            className={cn(
              'font-bold leading-none tracking-tight',
              titleClassName
            )}
          >
            {title}
          </h3>
        ) : (
          title
        )}
        {isChildrenString ? (
          <p
            className={cn(
              'text-sm text-muted-foreground',
              descriptionClassName
            )}
          >
            {children}
          </p>
        ) : (
          children
        )}
      </div>
      {iconAfter}
    </div>
  );
};

export { GroupItem };
