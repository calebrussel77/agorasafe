import { type ReactNode } from 'react';

import { Tooltip } from '@/components/ui/tooltip';

interface ActionTooltipProps {
  label: ReactNode;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

export const ActionTooltip = ({
  label,
  children,
  side,
  align,
}: ActionTooltipProps) => {
  return (
    <Tooltip delayDuration={50}>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Content
        side={side}
        align={align}
        hasArrow
        className="text-xs leading-6"
      >
        {label}
      </Tooltip.Content>
    </Tooltip>
  );
};
