import { type ProfileType } from '@prisma/client';
import { type FC, type PropsWithChildren, type ReactNode } from 'react';

import { useCurrentUser } from '@/hooks/use-current-user';

interface CanViewProps {
  profile: ProfileType;
  isPublic?: boolean;
  children: ReactNode;
}

const CanView = ({
  profile,
  isPublic,
  children,
}: PropsWithChildren<CanViewProps>) => {
  const { profile: currentProfile, session } = useCurrentUser();

  if (isPublic && !profile) return children;

  if (isPublic && profile && currentProfile?.type === profile) {
    return children;
  }

  return null;
};

export { CanView };
