import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { type CurrentProfile } from '@/features/profiles';

// define types for state values and actions separately
type State = {
  profile: CurrentProfile;
  isSessionExpired: boolean;
};

type Actions = {
  setProfile: (profile: CurrentProfile) => void;
  setIsSessionExpired: (isSessionExpired: boolean) => void;
  reset: () => void;
};

// define the initial state
const initialState: State = {
  profile: null,
  isSessionExpired: false,
};

export type ProfileStore = State & Actions;

export const AGORASAFE_SESSION_STORAGE_PROFILE = '__agorasafe_profile__';

export const useProfileStore = create<State & Actions>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setProfile: (profile: CurrentProfile) => set({ profile }),
        setIsSessionExpired: (isSessionExpired: boolean) =>
          set({ isSessionExpired }),
        reset: () => set(initialState),
      }),
      {
        name: AGORASAFE_SESSION_STORAGE_PROFILE,
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
