import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
    if (!socket) {
        socket = io(import.meta.env.VITE_SOCKET_URL, {
            transports: ["websocket", "polling"],
        });

        socket.on("connect", () => {
            console.log("✅ Socket Connected:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("❌ Socket Disconnected");
        });
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const emitNewOrder = (orderData) => {
    if (socket) {
        socket.emit("newOrder", orderData);
    }
};
