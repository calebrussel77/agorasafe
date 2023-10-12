import { type NextApiRequest } from 'next';
import { Server } from 'socket.io';

import type { NextApiResponseServerIo } from '@/types/socket-io';

export const config = {
  api: {
    bodyParser: false,
  },
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res?.socket?.server?.io) {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server as never, {
      path: '/api/socket/io',
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default SocketHandler;
