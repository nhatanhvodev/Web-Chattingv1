"use client";

import { 
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const envSite = process.env.NEXT_PUBLIC_SITE_URL;
    const envApp = process.env.NEXT_PUBLIC_APP_URL;
    const customSocket = process.env.NEXT_PUBLIC_SOCKET_URL; // URL for standalone socket server
    const baseUrl = customSocket || envSite || envApp || (typeof window !== 'undefined' ? window.location.origin : '');
    const useCustomServer = !!customSocket;

    const socketInstance = new (ClientIO as any)(baseUrl, {
      path: useCustomServer ? '/socket.io' : '/api/socket/io',
      addTrailingSlash: false,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      timeout: 15000,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}