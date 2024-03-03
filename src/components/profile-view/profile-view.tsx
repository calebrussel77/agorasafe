import { useEffect, useRef } from 'react';

import { api } from '@/utils/api';

import { useCurrentUser } from '@/hooks/use-current-user';

type ProfileViewProps = {
  profileId: string;
};

export function ProfileView({ profileId }: ProfileViewProps) {
  const { profile } = useCurrentUser();
  const addViewMutation = api.profiles.addView.useMutation();
  const observedEntityId = useRef<string | null>(null);
  const viewerId = profile?.id ?? null;

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (viewerId !== observedEntityId.current) {
        observedEntityId.current = viewerId;
        addViewMutation.mutate({
          profileId,
          viewerId: viewerId as never,
        });
      }
    }, 1500);
    return () => {
      clearTimeout(timeout);
    };
  }, [addViewMutation, profileId, viewerId]);

  return null;
}
