import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const wsUrl = "http://localhost:3001";

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const curSocket = io(wsUrl);

    curSocket.on("connect", () => {
      console.log("Connected to server");
      setSocket(curSocket);
    });

    curSocket.on("disconnect", () => {
      console.log("disconnected to server");
      setSocket(null);
    });

    return () => {
      curSocket.close();
    };
  }, []);
  return socket;
};

export default useSocket;
