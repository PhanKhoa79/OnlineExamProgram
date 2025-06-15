import api from '@/lib/axios';

// Lấy danh sách thông báo của người dùng hiện tại
export const getNotifications = async () => {
  return await api.get('/notifications');
};

// Đánh dấu thông báo đã đọc
export const markNotificationAsRead = async (notificationId: number) => {
  return await api.post(`/notifications/${notificationId}/read`);
};

// Đánh dấu tất cả thông báo đã đọc
export const markAllNotificationsAsRead = async () => {
  return await api.post('/notifications/mark-all-read');
};

// Xóa thông báo
export const deleteNotification = async (notificationId: number) => {
  return await api.delete(`/notifications/${notificationId}`);
}; 