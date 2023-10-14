import Link from 'next/link';
import React, { type FC, type ReactNode, memo } from 'react';

import { Anchor } from '@/components/anchor';

import { cn } from '@/lib/utils';

type NotificationActionProps = {
  children?: ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  href?: string;
  isPrimary?: boolean;
};

const ButtonAction: FC<Omit<NotificationActionProps, 'href'>> = ({
  className,
  isPrimary,
  onClick,
  children,
}) => {
  return (
    <button
      className={cn(
        'whitespace-nowrap text-sm font-medium text-gray-700 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
        isPrimary &&
          'text-primary-600 hover:text-primary-700 focus:ring-primary-500',
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const NotificationAction = memo(function NotificationAction({
  children,
  onClick,
  href,
  className,
  isPrimary = false,
}: NotificationActionProps) {
  return href ? (
    <Anchor href={href}>
      <ButtonAction
        onClick={onClick}
        isPrimary={isPrimary}
        className={className}
      >
        {children}
      </ButtonAction>
    </Anchor>
  ) : onClick ? (
    <ButtonAction onClick={onClick} isPrimary={isPrimary} className={className}>
      {children}
    </ButtonAction>
  ) : (
    <>{children}</>
  );
});

NotificationAction.displayName = 'NotificationAction';

export { NotificationAction };
