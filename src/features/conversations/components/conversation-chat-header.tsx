import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import { type ReactNode } from 'react';

import { SocketIndicator } from '@/components/socket-indicator';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

const ConversationDetailsBackButton = () => {
  const router = useRouter();

  const close = () => {
    const returnUrl = '/dashboard/inbox';
    void router.push(returnUrl, undefined, { shallow: true });
  };

  return (
    <Button
      className="flex h-auto w-auto py-2 lg:hidden"
      size="sm"
      variant="ghost"
      onClick={close}
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>
  );
};

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
        'sticky inset-x-0 top-0 z-10 flex w-full items-center justify-between border-b border-gray-200 py-3 shadow-sm lg:px-4',
        className
      )}
    >
      <div className="flex w-full flex-1 items-center gap-1">
        <ConversationDetailsBackButton />
        {user}
      </div>
      <SocketIndicator className="ml-2" />
    </div>
  );
};

export { ConversationChatHeader };
