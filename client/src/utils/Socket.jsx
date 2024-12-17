import { useContext, createContext, useMemo, useEffect } from "react";
import io from "socket.io-client";

// Environment variable for the backend server URL
const backendServer = import.meta.env.VITE_BASE_URL;

// Create a SocketContext to provide the socket instance
const SocketContext = createContext();

// Custom hook to access the socket
export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};





// SocketProvider to manage socket connection and provide it to the app
export const SocketProvider = ({ children }) => {
  // Create a socket instance using useMemo to avoid re-creating it on every render
  const socket = useMemo(() => io(backendServer, { withCredentials: true }), []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Socket connected:', socket.connected); // Should print true if connected
      //console.log('socket is =>>> ',socket)
      //console.log('Socket id is =>> ', socket.id)
    });
    
    // Cleanup the socket connection when the provider unmounts
    return () => {
      socket.disconnect();
      console.log('Socket disconnected');
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
