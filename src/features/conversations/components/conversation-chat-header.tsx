import { type ReactNode } from 'react';

import { SocketIndicator } from '@/components/socket-indicator';

import { cn } from '@/lib/utils';

const ConversationChatHeader = ({
  user,
  className,
}: React.PropsWithChildren<{
  className?: string;
  user: ReactNode;
}>) => {
  return (
    <div
      className={cn(
        'sticky inset-x-0 top-0 z-10 flex w-full items-center justify-between border-b border-gray-200 px-4 py-3 shadow-sm',
        className
      )}
    >
      {user}
      <SocketIndicator className="ml-2" />
    </div>
  );
};

export { ConversationChatHeader };
