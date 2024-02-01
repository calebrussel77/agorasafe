/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useProfileStore } from '@/stores/profile-store';
import { useSession } from 'next-auth/react';

import { postgresSlugify } from '@/utils/strings';

export const useCurrentUser = () => {
  const { data, status, update } = useSession();

  const { profile, reset, setProfile } = useProfileStore();

  const isAuth = status === 'authenticated';
  const isAuthWithProfile = isAuth && !!profile;

  return {
    session: data,
    isAuth,
    isAuthWithProfile,
    hasCurrentProfile: !!profile,
    profile,
    status,
    updateUser: update,
    updateProfile: setProfile,
    resetProfile: reset,
  };
};

export const useIsSameProfile = (username?: string | string[]) => {
  const { profile } = useCurrentUser();

  if (!username || !profile) return false;

  return (
    !!profile &&
    postgresSlugify(profile.name) ===
      // @ts-ignore
      postgresSlugify(typeof username === 'string' ? username : username[0])
  );
};
