import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // Backend URL

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: true,
});