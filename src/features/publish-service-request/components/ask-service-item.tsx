import { ChevronRight } from 'lucide-react';
import React, { type FC } from 'react';

import { Typography } from '@/components/ui/typography';

import { stringToHslColor } from '@/utils/misc';

import { cn } from '@/lib/utils';

interface AskServiceItemProps {
  className?: string;
  name: string;
}

const AskServiceItem: FC<
  AskServiceItemProps & React.ComponentProps<'button'>
> = ({ className, name, ...rest }) => {
  return (
    <button
      {...rest}
      className={cn(
        'group flex w-full cursor-pointer items-center rounded-lg border border-gray-200 px-3 py-2 shadow-sm transition duration-300 hover:bg-gray-100 focus:bg-gray-100 focus:ring focus:ring-brand-500',
        className
      )}
    >
      <div
        style={{ backgroundColor: stringToHslColor(name) }}
        className="mr-3 h-2 w-2 rounded-full"
      />
      <Typography className="flex-1 text-left">{name}</Typography>
      <ChevronRight className="ml-1 h-5 w-5 flex-shrink-0 text-muted-foreground group-hover:text-brand-500" />
    </button>
  );
};

export { AskServiceItem };
