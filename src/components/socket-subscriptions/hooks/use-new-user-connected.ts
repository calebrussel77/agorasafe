import { useSocketStore } from '@/stores/socket-store';
import { useEffect } from 'react';

import { socketEventsKey } from '@/server/api/constants';

import { useCurrentUser } from '@/hooks/use-current-user';

export const useNewUserConnected = () => {
  const { socket } = useSocketStore();
  const { profile } = useCurrentUser();
  const key = socketEventsKey.newUserConnected();

  useEffect(() => {
    if (!socket || !profile) {
      return;
    }

    socket.emit(key, profile);
  }, [socket, key, profile]);
};
