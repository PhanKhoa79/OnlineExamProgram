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
  private currentUser: { accountname: string; permissions?: { permissions: string[] }; id?: number } | null = null;

  connect(user: { accountname: string; permissions?: { permissions: string[] }; id?: number }) {
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
      this.isConnecting = false;
      
      // Test connection
      this.socket?.emit('test', { message: 'Hello from client' });
      
      // Đăng ký người dùng với socket server
      if (this.currentUser && this.currentUser.id && this.socket) {
        this.socket.emit('register', { userId: this.currentUser.id });
      } else {
        console.warn('⚠️ Cannot register user: Missing user ID or socket not connected');
      }
      
      this.callbacks.onConnect?.();
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnecting = false;
      this.callbacks.onDisconnect?.(reason);
    });

    this.socket.on('connect_error', (error) => {
      this.isConnecting = false;
      this.callbacks.onError?.(error as Error);
    });

    // Lắng nghe phản hồi từ sự kiện register
    this.socket.on('registered', (response: { success: boolean; error?: string }) => {
      if (response.success) {
        console.log('✅ User registration successful');
      } else {
        console.error('❌ User registration failed:', response.error);
      }
    });

    // Lắng nghe thông báo trực tiếp
    this.socket.on('notification', (newNotification: Notification) => {
      
      if (this.callbacks.onNotification) {
        this.callbacks.onNotification(newNotification);
      } else {
        console.warn('⚠️ No onNotification callback available!');
      }
    });

    // Lắng nghe thông báo theo permission
    this.socket.on('notification-permission', (data: { permission: string; notification: Notification }) => {
      
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