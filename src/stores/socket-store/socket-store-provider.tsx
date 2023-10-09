/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SOCKET_IO_PATH, WEBSITE_URL } from '@/constants';
import { createContext, useContext, useEffect, useRef } from 'react';
import { io as ClientIO } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { StoreApi, createStore, useStore } from 'zustand';

// define types for state values and actions separately
export type PersistedState = {
  isConnected: boolean;
  socket: Socket | null;
};

type Actions = {
  setState: (state: Partial<PersistedState>) => void;
  reset: () => void;
};

// define the initial state
export const initialState: PersistedState = {
  socket: null,
  isConnected: false,
};

export type SocketStore = PersistedState & Actions;

const StoreContext = createContext<StoreApi<SocketStore> | null>(null);

const SocketStoreProvider = ({ children }: React.PropsWithChildren) => {
  const storeRef = useRef<StoreApi<SocketStore> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createStore<SocketStore>()(set => ({
      ...initialState,
      setState: (newState: Partial<PersistedState>) =>
        set(state => ({ ...state, newState })),
      reset: () => set(initialState),
    }));
  }

  useEffect(() => {
    // @ts-ignore
    const socketInstance = ClientIO(WEBSITE_URL, {
      path: SOCKET_IO_PATH,
      addTrailingSlash: false,
      // transports: ['websocket', 'polling', 'flashsocket'],
    });

    socketInstance.on('connect', () => {
      storeRef.current?.setState({ isConnected: true });
    });

    socketInstance.on('disconnect', () => {
      storeRef.current?.setState({ isConnected: false });
    });

    storeRef.current?.setState({ socket: socketInstance });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};

const useSocketStore = () => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('Missing StoreProvider');
  }
  return useStore(store);
};

export { SocketStoreProvider, useSocketStore };
