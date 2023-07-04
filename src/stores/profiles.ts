import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import { type CurrentProfile } from '@/types/profiles';

// define types for state values and actions separately
type State = {
  profile: CurrentProfile;
};

type Actions = {
  setProfile: (profile: CurrentProfile) => void;
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
        setProfile: (profile: CurrentProfile) =>
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
