import React, { forwardRef, useCallback } from 'react';

import { Avatar, type AvatarProps } from './avatar';

export type MoreIndicatorProps = AvatarProps & {
  count: number;
  buttonProps?: Omit<Partial<React.HTMLAttributes<HTMLElement>>, 'color'>;
};
const MAX_DISPLAY_COUNT = 99;

export const MoreIndicator = forwardRef<never, MoreIndicatorProps>(
  ({ count, onClick, buttonProps = {}, ...rest }, ref) => {
    const onClickHander = useCallback(
      (event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        if (buttonProps.onClick) {
          buttonProps.onClick(event);
        }
        onClick?.(event);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [buttonProps.onClick, onClick]
    );

    return (
      <Avatar {...rest} ref={ref} onClick={onClickHander} {...buttonProps}>
        +{count > MAX_DISPLAY_COUNT ? MAX_DISPLAY_COUNT : count}
      </Avatar>
    );
  }
);

MoreIndicator.displayName = 'MoreIndicator';
