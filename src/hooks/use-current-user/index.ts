import { useProfileStore } from '@/stores/profiles';
import { useSession } from 'next-auth/react';

export const useCurrentUser = () => {
  const { data, status, update } = useSession();

  const { isSessionExpired, profile, reset, setProfile, setIsSessionExpired } =
    useProfileStore();

  const isAuth = status === 'authenticated';
  const isAuthWithProfile = isAuth && !!profile;

  return {
    session: data,
    isAuth,
    isAuthWithProfile,
    hasCurrentProfile: !!profile,
    isSessionExpired,
    profile,
    updateUser: update,
    updateIsSessionExpired: setIsSessionExpired,
    updateProfile: setProfile,
    resetProfile: reset,
  };
};
