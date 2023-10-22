import Cookies from 'js-cookie';
import { createContext, useContext } from 'react';
import { createStore, useStore as useZustandStore } from 'zustand';
import { type StateStorage, persist } from 'zustand/middleware';

import { createPersistStorage } from './persist-storage';

// define types for state values and actions separately
export type PersistedState = {
  isBetaTester: boolean;
};

type Actions = {
  setLaunch: (isBetaTester: boolean) => void;
  reset: () => void;
};

// define the initial state
export const initialState: PersistedState = {
  isBetaTester: false,
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

export type LaunchStore = PersistedState & Actions;

export const initialStateJSON = JSON.stringify(initialState);

export const agorasafeLaunchStorageName = '__agorasafe_launch__';

export type StoreType = ReturnType<typeof initializeLaunchStore>;

const zustandContext = createContext<StoreType | null>(null);

export const Provider = zustandContext.Provider;

export const initializeLaunchStore = (
  preloadedState: Partial<LaunchStore> = {}
) => {
  return createStore<LaunchStore>()(
    persist(
      set => ({
        ...initialState,
        ...preloadedState,
        setLaunch: (isBetaTester: boolean) =>
          set(state => ({ ...state, isBetaTester })),
        reset: () => set(initialState),
      }),
      {
        name: agorasafeLaunchStorageName,
        storage: createPersistStorage(() => CookieStorage),
        partialize: state => ({
          isBetaTester: state.isBetaTester,
        }),
      }
    )
  );
};

export const useLaunchStore = (): LaunchStore => {
  const store = useContext(zustandContext);

  if (!store) throw new Error('Launch Store is missing the provider');

  return useZustandStore(store, store => store);
};
