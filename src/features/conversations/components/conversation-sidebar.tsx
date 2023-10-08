import { ScrollArea } from '@/components/ui/scroll-area';

import { cn } from '@/lib/utils';

const ConversationSidebar = ({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) => {
  return (
    <ScrollArea
      className={cn(
        'h-full w-full max-w-[450px] border-r border-gray-300 ',
        className
      )}
    >
      {children}
    </ScrollArea>
  );
};

export { ConversationSidebar };
