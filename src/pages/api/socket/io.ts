import { type NextApiRequest } from 'next';
import { Server } from 'socket.io';

import type { NextApiResponseServerIo } from '@/types/socket-io';

export const config = {
  api: {
    bodyParser: false,
  },
};

const onError = (error: Error) => {
  console.log(`[SERVER]: server error : ${error?.message}`);
};

const onListenning = () => {
  console.log(`[SERVER]: server listening...`);
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  res?.socket?.server?.on('error', onError);
  res?.socket?.server?.on('listening', onListenning);

  if (!res?.socket?.server?.io) {
    const io = new Server(res.socket.server as never, {
      path: '/api/socket/io',
      addTrailingSlash: false,
    });

    io.on('connection', socket => {
      console.log(`[SOCKET-SERVER]: user connected: ${socket.id}`);

      socket.on('disconnect', () => {
        console.log(`[SOCKET-SERVER]: user disconnected: ${socket.id}`);
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
