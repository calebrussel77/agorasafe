import { ShieldAlert } from 'lucide-react';
import { type Session } from 'next-auth';
import { useRouter } from 'next/router';

import { ActionTooltip } from '@/components/action-tooltip';
import { Typography } from '@/components/ui/typography';
import { UserAvatar } from '@/components/user-avatar';
import { UserBadge } from '@/components/user-badge';

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
  connectedProfile,
  session,
}: ConversationListItemProps) => {
  const router = useRouter();
  const onProfileClick = () => {
    if (profile.id === connectedProfile.id) {
      return;
    }
    void router.push(`/u/${profile?.slug}`);
  };

  return (
    <div className="group flex w-full items-center p-4 transition hover:bg-black/5">
      <div className="group flex w-full items-start gap-x-2">
        <div className="cursor-pointer transition hover:drop-shadow-md">
          <UserAvatar
            src={profile.avatar as string}
            alt={profile?.name}
            type={profile?.type}
          />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex flex-1 items-center gap-x-1">
              <Typography
                truncate
                className="cursor-pointer font-semibold hover:underline"
              >
                {profile.name}
              </Typography>
              <ActionTooltip label={profile?.type}>
                <UserBadge type={profile?.type} withProfileTypeInitial />
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500">{timestamp}</span>
          </div>
          <Typography
            truncate
            className={cn(
              'text-sm text-zinc-500',
              isLastMessageDeleted && 'mt-1 italic text-zinc-500'
            )}
          >
            {lastMessage}
          </Typography>
        </div>
      </div>
    </div>
  );
};
