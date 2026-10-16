import { io } from "socket.io-client";

export function createSocket() {
  const token = localStorage.getItem("taskflow_token");
  if (!token) return null;
  return io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
    auth: { token }, transports: ["websocket", "polling"]
  });
}
