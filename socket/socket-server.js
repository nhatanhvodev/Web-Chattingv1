// Minimal standalone Socket.IO server for Railway deployment
if (process.env.NODE_ENV !== 'production') {
  try { require('dotenv').config(); } catch {}
}
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 8080;
const ALLOWED = (process.env.CORS_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || '*')
  .split(',')
  .map(s => s.trim().replace(/\/$/, ''));

console.log('[Socket] Allowed origins:', ALLOWED);

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
  } else {
    res.writeHead(404); res.end();
  }
});

const io = new Server(server, {
  path: '/socket.io',
  cors: {
    origin: (origin, cb) => {
      const normalized = origin ? origin.replace(/\/$/, '') : origin;
      if (!normalized || ALLOWED.includes('*') || ALLOWED.includes(normalized)) return cb(null, normalized);
      console.warn('[Socket] Blocked origin:', normalized);
      return cb(new Error('Origin not allowed'));
    },
    methods: ['GET','POST']
  },
  transports: ['websocket','polling']
});

io.on('connection', socket => {
  console.log('[Socket] Connected:', socket.id);
  socket.emit('ping', { t: Date.now() });
  socket.on('disconnect', reason => {
    console.log('[Socket] Disconnected:', socket.id, reason);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Socket] Listening on 0.0.0.0:${PORT}`);
});
