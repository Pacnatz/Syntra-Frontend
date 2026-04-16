import { createContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

// Socket Context for our entire Dashboard component
function SocketProvider({ children }) {
  const socketRef = useRef(null);
  useEffect(() => {
    socketRef.current = io("http://localhost:3001");
    return () => {
      socketRef.current.disconnect();
      socketRef.current = null;
    };
  }, []);
  return (
    <SocketContext.Provider value={{ socketRef }}>
      {children}
    </SocketContext.Provider>
  );
}

export { SocketProvider, SocketContext };
