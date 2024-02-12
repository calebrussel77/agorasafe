import { type NextApiRequest } from 'next';
import { Server } from 'socket.io';

import type { NextApiResponseServerIo } from '@/types/socket-io';

import { socketEventsKey } from '@/server/api/constants';
import { type SimpleProfile } from '@/server/api/modules/profiles';

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res?.socket?.server?.io) {
    const io = new Server(res.socket.server as never, {
      path: '/api/socket/io',
      addTrailingSlash: false,
    });

    io.on('connection', socket => {
      socket.on(
        socketEventsKey.newUserConnected(),
        (profile: SimpleProfile) => {
          console.log(
            `[New connected profile] : ${profile?.name} with socketId : ${socket.id}`
          );
        }
      );

      socket.on('disconnect', () => {
        console.log(`[SOCKET-SERVER]: user disconnected: ${socket.id}`);
        //Remove connected users
      });

      socket.on('error', error => {
        console.log(`[SOCKET-SERVER]: socket error : ${error?.message}`);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default SocketHandler;
