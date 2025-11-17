import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";

import { NextApiResponseServerIo } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path,
      // @ts-ignore
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || '*',
        methods: ["GET", "POST"],
        credentials: false,
      }
    });
    io.on('connection', (socket) => {
      // Simple heartbeat log for debugging desktop app
      socket.emit('ping', { t: Date.now() });
    });
    res.socket.server.io = io;
  }

  res.end();
}

export default ioHandler;
