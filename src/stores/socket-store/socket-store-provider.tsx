/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { APP_URL } from '@/constants';
import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { type StoreApi, createStore, useStore } from 'zustand';

import { SocketSubscriptions } from '@/components/socket-subscriptions';

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
    const socketInstance = io(window.location.origin || APP_URL, {
      path: '/api/socket/io',
    });

    socketInstance.on('error', err => {
      console.debug({ err });
    });

    socketInstance.on('connect_error', err => {
      console.debug('Failed to connect with websocket.', err);
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
      <SocketSubscriptions />
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
