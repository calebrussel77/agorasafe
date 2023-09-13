import React, { type FC, type ReactElement, type ReactNode } from 'react';

import { isString } from '@/utils/type-guards';

import { cn } from '@/lib/utils';

type ClassNames = {
  root: string;
  wrapper: string;
  name: string;
  description: string;
};

type GroupItemProps = {
  name: ReactNode;
  className?: string;
  description?: ReactNode;
  iconBefore?: ReactElement;
  iconAfter?: ReactElement;
  onClick?: () => void;
  /**
   * Classname or List of classes to change the classNames of the groupItem.
   * if `className` is passed, it will be added to the base slot.
   *
   * @example
   * ```ts
   * <GroupItem classNames={{
   *    root:"base-classes",
   *    wrapper: "wrapper-classes",
   *    name: "name-classes",
   *    description: "description-classes",
   * }} />
   * ```
   */
  classNames?: Partial<ClassNames>;
};

const GroupItem: FC<GroupItemProps> = ({
  className,
  description,
  name,
  classNames,
  iconAfter,
  iconBefore,
  onClick,
}) => {
  const isStringName = isString(name);
  const isStringDescription = isString(description);

  return (
    <div
      onClick={onClick}
      className={cn(
        'default__transition -mx-3 flex items-center gap-x-3 rounded-md px-3 py-2 hover:bg-gray-100',
        className,
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
