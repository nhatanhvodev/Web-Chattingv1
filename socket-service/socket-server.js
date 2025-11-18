require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

const DEFAULT_PORT = process.env.PORT || process.env.SOCKET_PORT || 4001;
const PORT = Number(DEFAULT_PORT);
const ALLOWED = (process.env.CORS_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "*")
  .split(",")
  .map((s) => s.trim().replace(/\/$/, ""))
  .filter(Boolean);

console.log("CORS allowed origins:", ALLOWED.length ? ALLOWED : ["*"]);

const server = http.createServer((req, res) => {
  if (req.url === "/health" || req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", uptime: process.uptime() }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: (origin, callback) => {
      const normalized = origin ? origin.replace(/\/$/, "") : origin;
      console.log("Socket handshake origin:", normalized);

      if (
        !normalized ||
        ALLOWED.includes("*") ||
        ALLOWED.includes(normalized)
      ) {
        return callback(null, normalized);
      }

      console.warn("Blocked socket origin:", normalized, "Allowed list:", ALLOWED);
      return callback(new Error("Origin not allowed"));
    },
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);
  socket.emit("ping", { t: Date.now() });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected", socket.id, reason);
  });
});

server.listen(PORT, () => {
  console.log(`Standalone Socket.IO listening on http://0.0.0.0:${PORT}`);
});

