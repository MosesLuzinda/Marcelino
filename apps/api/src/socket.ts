import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "@marcelino/shared";

export function initSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: { origin: process.env.CORS_ORIGIN || "http://localhost:3000", credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication required"));
    try {
      const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
      socket.data.user = user;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user as JwtPayload;
    socket.join(`user:${user.userId}`);

    socket.on("join:conversation", (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("message:send", (data: { conversationId: string; content: string }) => {
      io.to(`conversation:${data.conversationId}`).emit("message:new", {
        conversationId: data.conversationId,
        senderId: user.userId,
        content: data.content,
        createdAt: new Date().toISOString(),
      });
    });

    socket.on("notification:read", (id: string) => {
      socket.emit("notification:read:ack", { id });
    });
  });

  return io;
}
