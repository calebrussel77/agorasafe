import { type ReactNode } from 'react';

import { Tooltip } from '@/components/ui/tooltip';

import { cn } from '@/lib/utils';

interface ActionTooltipProps {
  label: ReactNode;
  children: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  asChild?: boolean;
  className?: string;
}

export const ActionTooltip = ({
  label,
  children,
  side,
  asChild = true,
  align,
  className,
}: ActionTooltipProps) => {
  return (
    <Tooltip delayDuration={50}>
      <Tooltip.Trigger asChild={asChild}>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side={side}
          align={align}
          hasArrow
          className={cn('text-xs leading-6', className)}
        >
          {label}
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip>
  );
};
