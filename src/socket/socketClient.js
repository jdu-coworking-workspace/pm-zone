import { io } from 'socket.io-client';
import { SOCKET_URL } from '../config/api';

class SocketClient {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.currentWorkspaceId = null; // Track current workspace for auto-rejoin
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    console.log('🔌 Connecting to Socket.IO server at:', SOCKET_URL);

    this.socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity, // Keep trying to reconnect
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      // Auto-rejoin workspace room on reconnection
      if (this.currentWorkspaceId) {
        this.socket.emit('join:workspace', this.currentWorkspaceId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  joinWorkspace(workspaceId) {
    this.currentWorkspaceId = workspaceId;
    
    if (this.socket?.connected) {
      this.socket.emit('join:workspace', workspaceId);
    }
  }

  leaveWorkspace(workspaceId) {
    if (this.currentWorkspaceId === workspaceId) {
      this.currentWorkspaceId = null;
    }
    
    if (this.socket?.connected) {
      this.socket.emit('leave:workspace', workspaceId);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
      if (this.listeners.has(event)) {
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export const socketClient = new SocketClient();

export default socketClient;
