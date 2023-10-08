import { useSocketStore } from '@/stores/socket-store';
import React, { type FC } from 'react';

import { cn } from '@/lib/utils';

import { Badge } from '../ui/badge';

interface SocketIndicatorProps {
  className?: string;
}

const SocketIndicator: FC<SocketIndicatorProps> = ({ className }) => {
  const { isConnected } = useSocketStore();

  if (!isConnected) {
    return (
      <Badge
        content="Reconnexion en cours..."
        variant="outline"
        className={cn(
          'border-none bg-yellow-600 px-2.5 py-1.5 text-xs text-white',
          className
        )}
      />
    );
  }
  return (
    <Badge
      content="Temps réel"
      variant="outline"
      className={cn('bg-green-600 px-2.5 py-1 text-xs text-white', className)}
    />
  );
};

export { SocketIndicator };
