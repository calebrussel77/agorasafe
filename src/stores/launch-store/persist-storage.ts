import type { PersistStorage, StorageValue } from 'zustand/middleware';

import { deSerialize, serialize } from '@/utils/text';

import type { CookieStorage, PersistedState } from './launch';
import { initialStateJSON } from './launch';

type StateStorage = typeof CookieStorage;

export const createPersistStorage = (getStorage: () => StateStorage) => {
  const storage = getStorage();

  const persistStorage: PersistStorage<PersistedState> = {
    getItem: name => {
      const value = (storage.getItem(name) as string) ?? initialStateJSON;

      return deSerialize<StorageValue<PersistedState>>(
        value ?? initialStateJSON
      );
    },
    setItem: (name, newValue) => {
      return storage.setItem(name, serialize(newValue));
    },
    removeItem: name => storage.removeItem(name),
  };

  return persistStorage;
};
