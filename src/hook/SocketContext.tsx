"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useUser } from "./AuthContext";
import { io } from "socket.io-client";

interface SocketContextType {
  socket: any;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { socket, user, isAuthenticated } = useUser();

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    socket.current = io(socketUrl);
    console.log("Kết nối socket thành công");
  }, [user?.data?._id, socket.current]);

  useEffect(() => {
    socket.current?.emit("new-connection", user);
    //     console.log("Nhận lên");
  }, [user?.data?._id, socket.current]);

  useEffect(() => {
    socket.current?.on("return-users", (users: any) => {});
    //     console.log("Gửi về");
  }, [user?.data?._id, socket.current]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
