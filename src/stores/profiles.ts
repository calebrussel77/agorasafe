import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { type GetUserProfilesOutput } from '@/features/profiles';

// define types for state values and actions separately
type State = {
  profile: GetUserProfilesOutput['profiles'][0] | null;
};

type Actions = {
  setProfile: (profile: GetUserProfilesOutput['profiles'][0]) => void;
  reset: () => void;
};

// define the initial state
const initialState: State = {
  profile: null,
};

export const useProfileStore = create<State & Actions>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        setProfile: (profile: GetUserProfilesOutput['profiles'][0]) =>
          set({ profile }),
        reset: () => set(initialState),
      }),
      {
        name: 'agorasafe-profile',
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
