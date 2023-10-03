import { ScrollArea } from '@/components/ui/scroll-area';

import { cn } from '@/lib/utils';

const ConversationChatHeader = ({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) => {
  return (
    <div
      className={cn('w-full border-b border-gray-200 shadow-md', className)}
    >
      
    </div>
  );
};

export { ConversationChatHeader };
