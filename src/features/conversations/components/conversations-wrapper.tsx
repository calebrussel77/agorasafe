import { useRouter } from 'next/router';
import React, { type FC, type ReactNode } from 'react';

import { ContentTitle } from '@/features/user-dashboard';

import { cn } from '@/lib/utils';

import { useHeaderHeight } from '@/hooks/use-header-height';

import { ConversationSidebar } from './conversation-sidebar';

interface ConversationsWrapperProps {
  className?: string;
  conversationList?: ReactNode;
  conversationDetails?: ReactNode;
}

const ConversationsWrapper: FC<ConversationsWrapperProps> = ({
  conversationDetails,
  conversationList,
}) => {
  const { height } = useHeaderHeight();
  const { query } = useRouter();
  const profileId = query?.profileId as string;

  return (
    <div
      style={{
        height: `calc(100vh - ${Number(height) + 2}px)`,
      }}
      className="flex w-full overflow-hidden"
    >
      <ConversationSidebar
        className={cn(
          profileId
            ? 'hidden lg:flex lg:h-full lg:w-full lg:flex-1 lg:flex-col'
            : 'flex h-full w-full flex-1 flex-col'
        )}
      >
        <ContentTitle className="sticky inset-x-0 top-0 z-10 flex w-full items-center justify-between border-b border-gray-200 px-4 py-[15px] shadow-sm">
          Conversations
        </ContentTitle>
        {conversationList}
      </ConversationSidebar>
      <div
        className={cn(
          'flex h-full w-full flex-1 flex-col',
          !profileId && 'hidden items-center justify-center lg:flex'
        )}
      >
        {conversationDetails}
      </div>
    </div>
  );
};

export { ConversationsWrapper };
