import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const TooltipComponent = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipPortal = TooltipPrimitive.Portal;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    hasArrow?: boolean;
  }
>(
  (
    { className, children, hasArrow = false, sideOffset = 4, ...props },
    ref
  ) => (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 max-w-[420px] overflow-hidden rounded-md bg-gray-800 px-3 py-1.5 text-sm text-white shadow-md animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1',
        className
      )}
      {...props}
    >
      {hasArrow && (
        <TooltipPrimitive.Arrow
          className="fill-current stroke-current text-gray-800 shadow-md"
          height={6}
          width={12}
        />
      )}
      {children}
    </TooltipPrimitive.Content>
  )
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const TooltipRoot: React.FC<
  React.ComponentProps<typeof TooltipPrimitive.Root> &
    React.ComponentProps<typeof TooltipPrimitive.Provider>
> = ({
  children,
  delayDuration,
  skipDelayDuration,
  disableHoverableContent,
  ...props
}) => {
  return (
    <TooltipProvider
      {...{ delayDuration, skipDelayDuration, disableHoverableContent }}
    >
      <TooltipComponent {...props}>{children}</TooltipComponent>
    </TooltipProvider>
  );
};

// Nested exports
export const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Content: TooltipContent,
});
