import { type Session } from 'next-auth';

import { RenderHtml } from '@/components/render-html';
import { Typography } from '@/components/ui/typography';
import { UserAvatar, UserName } from '@/components/user';

import { removeTags } from '@/utils/strings';

import { cn } from '@/lib/utils';

import { type SimpleProfile } from '@/server/api/modules/profiles';

interface ConversationListItemProps {
  isLastMessageDeleted: boolean;
  lastMessage: string;
  profile: SimpleProfile;
  session: Session | null;
  timestamp: string;
  connectedProfile: SimpleProfile;
}

export const ConversationListItem = ({
  isLastMessageDeleted,
  lastMessage,
  profile,
  timestamp,
}: ConversationListItemProps) => {
  return (
    <div className="flex w-full items-center gap-3 p-4 transition hover:bg-gray-100">
      <UserAvatar profile={profile} />
      <div className="flex w-full flex-1 flex-col">
        <div className="flex items-center gap-x-2">
          <UserName profile={profile} withProfileBadgeInitial />
          <span className="text-xs text-zinc-500">{timestamp}</span>
        </div>
        <RenderHtml
          truncate
          lines={1}
          hasEllipsisText={false}
          className={cn(
            'not-prose text-sm text-zinc-500',
            isLastMessageDeleted && 'mt-1 italic text-zinc-500'
          )}
          html={removeTags(lastMessage)}
        />
      </div>
    </div>
  );
};
