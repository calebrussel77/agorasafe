import { Lock } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Typography } from '../typography';

type ClassNames = {
  root: string;
  wrapper: string;
  name: string;
  description: string;
  icon: string;
};

export interface EmptyStateProps {
  name?: React.ReactElement | string;
  className?: string;
  description?: React.ReactNode;
  iconBefore?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  tertiaryAction?: React.ReactNode;
  icon?: React.ReactElement;
  /**
   * Classname or List of classes to change the classNames of the EmptyState.
   * if `className` is passed, it will be added to the base slot.
   *
   * @example
   * ```ts
   * <EmptyState classNames={{
   *    root:"base-classes",
   *    wrapper: "wrapper-classes",
   *    name: "name-classes",
   *    description: "description-classes",
   *    icon: "icon-classes",
   * }} />
   * ```
   */
  classNames?: Partial<ClassNames>;
}

/**
 * Component to tell users there's no state.
 *
 * @example
 * ```ts
 *  <EmptyState
 *  name="You don't have access to this issue"
 *  description="Make sure the issue exists in this project. If it does, ask a project admin for permission to see the project's issues."
 *  primaryAction={<Button>Request Access</Button>}
 *  secondaryAction={<Button variant="outline">View Permissions</Button>}
 *  tertiaryAction={<Button variant="link">Learn More</Button>}
 *  />
 * ```
 */

function EmptyState({
  className,
  classNames,
  icon = <Lock />,
  primaryAction,
  secondaryAction,
  tertiaryAction,
  name,
  description,
  ...props
}: EmptyStateProps) {
  const hasMainAction = primaryAction || secondaryAction;

  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-3',
        classNames?.root,
        className
      )}
      {...props}
    >
      {React.cloneElement(icon, {
        className: cn(
          'flex-shrink-0 h-20 w-20 text-muted-foreground',
          classNames?.icon
        ),
      })}
      {name && (
        <Typography as="h3" className={cn('text-center', classNames?.name)}>
          {name}
        </Typography>
      )}
      {description && (
        <Typography
          className={cn(
            'text-center text-muted-foreground',
            classNames?.description
          )}
        >
          {description}
        </Typography>
      )}
      {hasMainAction && (
        <div className="flex items-center justify-center gap-3">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
      {tertiaryAction}
    </div>
  );
}

export { EmptyState };
