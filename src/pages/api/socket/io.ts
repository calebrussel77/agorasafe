import { SOCKET_IO_PATH, WEBSITE_URL } from '@/constants';
import type { Server as NetServer } from 'http';
import { type NextApiRequest } from 'next';
import { Server as IOServer } from 'socket.io';

import type { NextApiResponseServerIo } from '@/types/socket-io';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as never;
    const io = new IOServer(httpServer, {
      path: SOCKET_IO_PATH,
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
