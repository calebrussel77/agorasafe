import { useProfileStore } from '@/stores/profile-store';
import { useSession } from 'next-auth/react';

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
