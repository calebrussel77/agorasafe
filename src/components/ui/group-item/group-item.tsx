import React, { type FC, type ReactElement, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ClassNames = {
  root: string;
  wrapper: string;
  name: string;
  description: string;
};

type GroupItemProps = {
  name: ReactElement;
  description?: ReactNode;
  classNames?: Partial<ClassNames>;
  iconBefore?: ReactElement;
  iconAfter?: ReactElement;
  onClick?: () => void;
};

const GroupItem: FC<GroupItemProps> = ({
  description,
  name,
  classNames,
  iconAfter,
  iconBefore,
  onClick,
}) => {
  const isStringName = typeof name === 'string';
  const isStringDescription = typeof description === 'string';

  return (
    <div
      onClick={onClick}
      className={cn(
        '-mx-3 flex items-center gap-x-3 rounded-md px-3 py-2 hover:bg-gray-100',
        classNames?.root
      )}
    >
      {iconBefore && <div className="flex-shrink-0">{iconBefore}</div>}
      <div
        className={cn(
          'flex flex-grow flex-col items-start justify-start gap-y-0.5',
          classNames?.wrapper
        )}
      >
        {isStringName ? (
          <h3
            className={cn(
              'font-bold leading-none tracking-tight',
              classNames?.name
            )}
          >
            {name}
          </h3>
        ) : (
          name
        )}
        {isStringDescription ? (
          <p
            className={cn(
              'text-sm text-muted-foreground',
              classNames?.description
            )}
          >
            {description}
          </p>
        ) : (
          description
        )}
      </div>
      {iconAfter && <div className="flex-shrink-0">{iconAfter}</div>}
    </div>
  );
};

export { GroupItem };
