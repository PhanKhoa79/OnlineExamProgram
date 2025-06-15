import { io, Socket } from 'socket.io-client';
import { Notification } from '../types/notification';

class WebSocketService {
  private socket: Socket | null = null;
  private isConnecting = false;
  private callbacks: {
    onNotification?: (notification: Notification) => void;
    onPermissionNotification?: (data: { permission: string; notification: Notification }) => void;
    onConnect?: () => void;
    onDisconnect?: (reason: string) => void;
    onError?: (error: Error) => void;
  } = {};
  private currentUser: { accountname: string; permissions?: { permissions: string[] } } | null = null;

  connect(user: { accountname: string; permissions?: { permissions: string[] } }) {
    // Nếu đã connected với cùng user, không cần reconnect
    if (this.socket?.connected && this.currentUser?.accountname === user.accountname) {
      console.log('🔗 Already connected for user:', user.accountname);
      return;
    }

    // Nếu đang kết nối, chờ
    if (this.isConnecting) {
      console.log('⏳ Connection in progress...');
      return;
    }

    // Disconnect existing connection nếu có
    if (this.socket) {
      console.log('🔄 Disconnecting existing connection...');
      this.socket.disconnect();
      this.socket = null;
    }

    this.isConnecting = true;
    this.currentUser = user;
    

    this.socket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true // Force tạo connection mới để tránh cache
    });

    // Setup event listeners
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Connected to notification socket');
      console.log('🆔 Socket ID:', this.socket?.id);
      this.isConnecting = false;
      
      // Test connection
      console.log('🧪 Testing socket connection...');
      this.socket?.emit('test', { message: 'Hello from client' });
      
      this.callbacks.onConnect?.();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from notification socket:', reason);
      this.isConnecting = false;
      this.callbacks.onDisconnect?.(reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      this.isConnecting = false;
      this.callbacks.onError?.(error as Error);
    });

    // Lắng nghe thông báo trực tiếp
    this.socket.on('notification', (newNotification: Notification) => {
      console.log('📨 [WebSocket] Received direct notification:', newNotification);
      console.log('📨 [WebSocket] Notification structure:', JSON.stringify(newNotification, null, 2));
      console.log('📨 [WebSocket] Notification ID type:', typeof newNotification.id);
      console.log('📨 [WebSocket] Current callbacks available:', !!this.callbacks.onNotification);
      
      if (this.callbacks.onNotification) {
        this.callbacks.onNotification(newNotification);
      } else {
        console.warn('⚠️ No onNotification callback available!');
      }
    });

    // Lắng nghe thông báo theo permission
    this.socket.on('notification-permission', (data: { permission: string; notification: Notification }) => {
      console.log('📨 [WebSocket] Received permission-based notification:', data);
      console.log('📨 [WebSocket] Data structure:', JSON.stringify(data, null, 2));
      console.log('📨 [WebSocket] Required permission:', data.permission);
      console.log('📨 [WebSocket] Notification ID:', data.notification?.id);
      console.log('📨 [WebSocket] Notification ID type:', typeof data.notification?.id);
      console.log('📨 [WebSocket] Current callbacks available:', !!this.callbacks.onPermissionNotification);
      
      if (this.callbacks.onPermissionNotification) {
        this.callbacks.onPermissionNotification(data);
      } else {
        console.warn('⚠️ No onPermissionNotification callback available!');
      }
    });

    // Debug: Log all events
    this.socket.onAny((eventName, ...args) => {
      console.log('🔊 [WebSocket] Event received:', eventName, args);
    });
  }

  disconnect() {
    if (this.socket) {
      console.log('🧹 Disconnecting WebSocket');
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
      this.currentUser = null;
    }
  }

  setCallbacks(callbacks: typeof this.callbacks) {
    console.log('🔧 Setting WebSocket callbacks:', Object.keys(callbacks));
    this.callbacks = { ...callbacks };
    
    // Log để debug
    console.log('🔧 Callbacks after setting:', {
      onNotification: !!this.callbacks.onNotification,
      onPermissionNotification: !!this.callbacks.onPermissionNotification,
      onConnect: !!this.callbacks.onConnect,
      onDisconnect: !!this.callbacks.onDisconnect,
      onError: !!this.callbacks.onError
    });
  }

  isConnected() {
    const connected = this.socket?.connected || false;
    console.log('🔍 WebSocket connection status:', connected);
    return connected;
  }

  getSocket() {
    return this.socket;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

// Singleton instance
export const websocketService = new WebSocketService(); 