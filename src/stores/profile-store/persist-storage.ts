import type { PersistStorage, StorageValue } from 'zustand/middleware';

import type { CookieStorage, PersistedState } from './profiles';
import { initialStateJSON } from './profiles';

type StateStorage = typeof CookieStorage;

export const createPersistStorage = (getStorage: () => StateStorage) => {
  const storage = getStorage();

  const persistStorage: PersistStorage<PersistedState> = {
    getItem: name => {
      const value: string = storage.getItem(name) ?? initialStateJSON;

      return JSON.parse(
        value ?? initialStateJSON
      ) as StorageValue<PersistedState>;
      // return JSON.parse(
      //   decompress(value) ?? initialStateJSON
      // ) as StorageValue<PersistedState>;
    },
    setItem: (name, newValue) => {
      return storage.setItem(name, JSON.stringify(newValue));
      // return storage.setItem(name, compress(JSON.stringify(newValue)));
    },
    removeItem: name => storage.removeItem(name),
  };

  return persistStorage;
};
