import express from 'express';
import { createServer } from 'http';
import { createServer as createHttpsServer } from 'https';
import { readFileSync } from 'fs';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import config from './config/env.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import workspaceRoutes from './routes/workspace.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import commentRoutes from './routes/comment.routes.js';
import userRoutes from './routes/user.routes.js';
import { verifyToken } from './utils/jwt.js';
import prisma from './config/prisma.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Try to use HTTPS if certificates exist, fallback to HTTP
let httpServer;
let useHttps = false;

try {
  const certPath = join(__dirname, '../certs/cert.pem');
  const keyPath = join(__dirname, '../certs/key.pem');
  
  const httpsOptions = {
    key: readFileSync(keyPath),
    cert: readFileSync(certPath),
  };
  
  httpServer = createHttpsServer(httpsOptions, app);
  useHttps = true;
  console.log('🔐 HTTPS enabled for backend');
} catch (error) {
  httpServer = createServer(app);
  console.log('⚠️  Running backend on HTTP (HTTPS certs not found)');
}

// Socket.IO setup
const io = new Server(httpServer, {
  cors: config.cors,
});

// Middleware
app.use(helmet());
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Socket.IO authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return next(new Error('Authentication error: Invalid token'));
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.userId = user.id;
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.user.name} (${socket.userId})`);

  // Join workspace rooms
  socket.on('join:workspace', async (workspaceId) => {
    try {
      // Verify user is a member of this workspace
      const membership = await prisma.workspaceMember.findFirst({
        where: {
          userId: socket.userId,
          workspaceId: workspaceId,
        },
      });

      if (!membership) {
        socket.emit('error', { message: 'Not a member of this workspace' });
        return;
      }

      const roomName = `workspace:${workspaceId}`;
      socket.join(roomName);
      const socketsCount = (await io.in(roomName).fetchSockets()).length;
      console.log(`📁 ${socket.user.name} joined ${roomName} (${socketsCount} total clients)`);

      // Notify others in the workspace
      socket.to(roomName).emit('user:online', {
        userId: socket.userId,
        user: socket.user,
        workspaceId,
      });

      // Send current online users in this workspace
      const socketsInRoom = await io.in(roomName).fetchSockets();
      const onlineUsers = socketsInRoom.map(s => ({
        userId: s.userId,
        user: s.user,
      }));

      socket.emit('workspace:online:users', {
        workspaceId,
        users: onlineUsers,
      });
    } catch (error) {
      console.error('Error joining workspace:', error);
      socket.emit('error', { message: 'Failed to join workspace' });
    }
  });

  // Leave workspace room
  socket.on('leave:workspace', (workspaceId) => {
    const roomName = `workspace:${workspaceId}`;
    socket.leave(roomName);
    console.log(`📂 ${socket.user.name} left ${roomName}`);

    // Notify others
    socket.to(roomName).emit('user:offline', {
      userId: socket.userId,
      user: socket.user,
      workspaceId,
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.user.name} (${socket.userId})`);
    
    // Notify all rooms this user was in
    socket.rooms.forEach((room) => {
      if (room !== socket.id && room.startsWith('workspace:')) {
        socket.to(room).emit('user:offline', {
          userId: socket.userId,
          user: socket.user,
        });
      }
    });
  });
});

// Export io for use in controllers
export { io };

// Start server
const PORT = config.port;
const HOST = '0.0.0.0'; // Bind to all network interfaces

httpServer.listen(PORT, HOST, () => {
  const protocol = useHttps ? 'https' : 'http';
  const localIP = '192.168.100.70'; // Update this if IP changes
  
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🚀 Server running on:`);
  console.log(`   Local:   ${protocol}://localhost:${PORT}`);
  console.log(`   Network: ${protocol}://${localIP}:${PORT}`);
  console.log(`⚡ Socket.IO ready for connections`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🔐 CORS enabled for: ${config.cors.origin === true ? 'ALL ORIGINS (*)' : config.cors.origin}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
});

export default app;

// Debug endpoint to check room status
app.get('/api/debug/rooms', (req, res) => {
  const rooms = {};
  io.sockets.adapter.rooms.forEach((sockets, roomName) => {
    if (!roomName.startsWith('workspace:')) return;
    rooms[roomName] = {
      count: sockets.size,
      socketIds: Array.from(sockets)
    };
  });
  res.json({ rooms });
});
