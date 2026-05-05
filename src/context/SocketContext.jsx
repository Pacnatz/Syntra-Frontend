import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

// Socket Context for our entire Dashboard component
function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [isSocketReady, setIsSocketReady] = useState(false);

  useEffect(() => {
    socketRef.current = io();

    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server");
      setIsSocketReady(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
      setIsSocketReady(false);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socketRef, isSocketReady }}>
      {children}
    </SocketContext.Provider>
  );
}

export { SocketProvider, SocketContext };
