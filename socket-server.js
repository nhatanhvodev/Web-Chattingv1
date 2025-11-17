// Simple standalone Socket.IO server to bypass Next.js API 500 issues on Render
// Run locally: npm run socket:dev
// Deploy: create a separate service on Render using `node socket-server.js`
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || process.env.SOCKET_PORT || 4001;
const ALLOWED = (process.env.CORS_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || '*')
  .split(',')
  .map(s => s.trim().replace(/\/$/, ''));

console.log('CORS allowed origins:', ALLOWED);

const server = http.createServer((req, res) => {
  // Health check endpoint for Render
  if (req.url === '/health' || req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
  } else {
    res.writeHead(404);
    res.end();
  }
});
const io = new Server(server, {
  path: '/socket.io',
  cors: {
    origin: (origin, cb) => {
      const normalized = origin ? origin.replace(/\/$/, '') : origin;
      console.log('Socket handshake origin:', normalized);
      if (!normalized || ALLOWED.includes('*') || ALLOWED.includes(normalized)) return cb(null, normalized);
      console.warn('Blocked socket origin:', normalized, 'Allowed list:', ALLOWED);
      return cb(new Error('Origin not allowed'));
    },
    methods: ['GET','POST'],
  },
  transports: ['websocket','polling'],
});

io.on('connection', (socket) => {
  console.log('Socket connected', socket.id);
  socket.emit('ping', { t: Date.now() });
  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected', socket.id, reason);
  });
});

server.listen(PORT, () => {
  console.log(`Standalone Socket.IO listening on http://localhost:${PORT}`);
});
