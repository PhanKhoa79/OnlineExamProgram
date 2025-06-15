import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '@/features/notifications/types/notification';
import { 
  getNotifications, 
  markNotificationAsRead, 
  deleteNotification as deleteNotificationAPI, 
  markAllNotificationsAsRead 
} from '@/features/notifications/services/notificationService';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getNotifications();
      return response.data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể tải thông báo';
      return rejectWithValue(errorMessage);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      await markNotificationAsRead(notificationId);
      return notificationId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể đánh dấu đã đọc';
      return rejectWithValue(errorMessage);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await markAllNotificationsAsRead();
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể đánh dấu tất cả đã đọc';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notification/deleteNotification',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      await deleteNotificationAPI(notificationId);
      return notificationId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Không thể xóa thông báo';
      return rejectWithValue(errorMessage);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Thêm thông báo mới (từ WebSocket)
    addNotification: (state, action: PayloadAction<Notification>) => {
      const newNotification = action.payload;
      
      
      // Kiểm tra xem thông báo đã tồn tại chưa để tránh duplicate
      const exists = state.notifications.find(n => n.id === newNotification.id);
      if (exists) {
        console.log('⚠️ [Redux] Notification already exists, skipping:', newNotification.id);
        return;
      }
      
      // Tạo một copy mới của notification để đảm bảo immutability
      const notificationCopy = {
        ...newNotification,
        id: newNotification.id,
        message: newNotification.message,
        isRead: newNotification.isRead,
        createdAt: newNotification.createdAt,
        metadata: newNotification.metadata ? { ...newNotification.metadata } : undefined
      };
      
      // Thêm vào đầu danh sách
      state.notifications.unshift(notificationCopy);
      
      // Cập nhật unread count
      if (!notificationCopy.isRead) {
        state.unreadCount = state.unreadCount + 1;
      }
      
    },
    
    // Cập nhật số lượng unread count
    updateUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = Math.max(0, action.payload);
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Reset state
    resetNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.error = null;
      state.isLoading = false;
    },
    
    // Force update để trigger re-render
    forceUpdate: (state) => {
      // Tạo một reference mới để force re-render
      state.notifications = [...state.notifications];
    }
  },
  extraReducers: (builder) => {
    // Fetch notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n: Notification) => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Mark as read
    builder
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find(n => n.id === notificationId);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Mark all as read
    builder
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.isRead = true;
        });
        state.unreadCount = 0;
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Delete notification
    builder
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const deletedNotification = state.notifications.find(n => n.id === notificationId);
        
        state.notifications = state.notifications.filter(n => n.id !== notificationId);
        
        // Giảm unreadCount nếu thông báo bị xóa chưa được đọc
        if (deletedNotification && !deletedNotification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export const { 
  addNotification, 
  updateUnreadCount, 
  clearError, 
  resetNotifications,
  forceUpdate 
} = notificationSlice.actions;

export default notificationSlice.reducer; 