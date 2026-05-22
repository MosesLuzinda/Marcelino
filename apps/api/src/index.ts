import "./config/env.js";
import http from "http";
import { app } from "./app.js";
import { initSocket } from "./socket.js";

const PORT = process.env.API_PORT || 4000;

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Marcelino API running on http://localhost:${PORT}`);
  console.log(`API docs: http://localhost:${PORT}/api/docs`);
});
