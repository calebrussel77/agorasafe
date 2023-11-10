import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as React from 'react';

import { cn } from '@/lib/utils';

type LabelPosition = 'center' | 'start' | 'end';

type ClassNames = {
  separator: string;
  label: string;
};

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
    label?: string;
    labelPosition?: LabelPosition;
    classNames?: Partial<ClassNames>;
  }
>(
  (
    {
      className,
      orientation = 'horizontal',
      label,
      labelPosition = 'center',
      decorative = true,
      classNames,
      ...props
    },
    ref
  ) => {
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(
          'relative shrink-0 bg-border',
          orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
          className,
          classNames?.separator
        )}
        {...props}
      >
        {label && (
          <span
            className={cn(
              'absolute z-10 bg-white px-2 py-1',
              labelPosition === 'center' &&
                'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              labelPosition === 'start' &&
                'left-0 -translate-y-[65%] translate-x-0 pl-0 pr-2',
              labelPosition === 'end' &&
                'right-0 -translate-y-[65%] translate-x-0 pl-2 pr-0',
              classNames?.label
            )}
          >
            {label}
          </span>
        )}
      </SeparatorPrimitive.Root>
    );
  }
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
