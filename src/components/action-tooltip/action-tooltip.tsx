import { type ReactNode } from 'react';

import { Tooltip } from '@/components/ui/tooltip';

interface ActionTooltipProps {
  label: ReactNode;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  asChild?:boolean
}

export const ActionTooltip = ({
  label,
  children,
  side,
  asChild = true,
  align,
}: ActionTooltipProps) => {
  return (
    <Tooltip delayDuration={50}>
      <Tooltip.Trigger asChild={asChild}>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side={side}
          align={align}
          hasArrow
          className="text-xs leading-6"
        >
          {label}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip>
  );
};
