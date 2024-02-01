import { profileVersion } from '@/constants';
import Cookies from 'js-cookie';
import { createContext, useContext } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';
import { type StateStorage, persist } from 'zustand/middleware';

import { type SimpleProfile } from '@/server/api/modules/profiles';

import { createPersistStorage } from './persist-storage';

// define types for state values and actions separately
export type PersistedState = {
  profile: SimpleProfile | null;
};

type Actions = {
  setProfile: (profile: SimpleProfile) => void;
  reset: () => void;
};

// define the initial state
export const initialState: PersistedState = {
  profile: null,
};

export const CookieStorage: StateStorage = {
  getItem: name => {
    return Cookies.get(name) ?? null;
  },
  setItem: (name, value) => {
    Cookies.set(name, value, {
      sameSite: 'lax',
      path: '/',
      expires: 30 * 24 * 60 * 60, // 30 days
      secure: process.env.NODE_ENV === 'production',
    });
  },
  removeItem: name => {
    return Cookies.remove(name, { path: '/' });
  },
};

export type ProfileStore = PersistedState & Actions;

export const initialStateJSON = JSON.stringify(initialState);

export const agorasafeProfileStorageName = '__agorasafe_profile__';

export type StoreType = ReturnType<typeof initializeProfileStore>;

const zustandContext = createContext<StoreType | null>(null);

export const Provider = zustandContext.Provider;

export const initializeProfileStore = (
  preloadedState: Partial<ProfileStore> = {}
) => {
  return createStore<ProfileStore>()(
    persist(
      set => ({
        ...initialState,
        ...preloadedState,
        setProfile: (profile: SimpleProfile) =>
          set(state => ({ ...state, profile })),
        reset: () => set(initialState),
      }),
      {
        name: agorasafeProfileStorageName,
        storage: createPersistStorage(() => CookieStorage),
        partialize: state => ({
          profile: state.profile,
        }),
        version: profileVersion,
      }
    )
  );
};

export const useProfileStore = (): ProfileStore => {
  const store = useContext(zustandContext);

  if (!store) throw new Error('Store is missing the provider');

  return useZustandStore(store, store => store);
};
