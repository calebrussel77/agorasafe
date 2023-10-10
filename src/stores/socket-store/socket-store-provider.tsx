/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { WEBSITE_URL } from '@/constants';
import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { type StoreApi, createStore, useStore } from 'zustand';

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
    const socketInstance = io(WEBSITE_URL, {
      path: '/api/socket/io',
      ackTimeout: 10000,
      retries: 3,
      // addTrailingSlash: false,
      // transports: ['websocket'],
      // enable retries
    });

    socketInstance.on('error', err => {
      console.error({ err });
    });

    socketInstance.on('connect_error', err => {
      console.error('Failed to connect with websocket.', err);
    });

    socketInstance.on('connect', () => {
      console.log('Connected on the client');
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
