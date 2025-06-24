import { AxiosInstance } from 'axios';

export const setupInterceptors = (api: AxiosInstance) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {  
      const originalRequest = error.config;

      // Danh sách các đường dẫn công khai không cần refresh token
      const publicPaths = [
        '/auth/login',
        '/auth/refresh-token',
        '/account/activate',
        '/auth/verify-activation-token',
        '/auth/find-email-by-token',
        '/auth/forgot-password',
        '/auth/reset-password',
        '/auth/verify-reset-code',
        '/auth/request-activation'
      ];

      // Kiểm tra xem request hiện tại có phải là đường dẫn công khai không
      const isPublicPath = publicPaths.some(path => 
        originalRequest.url.includes(path)
      );

      if (error.response?.status === 401 && !originalRequest._retry && !isPublicPath) {
        originalRequest._retry = true;

        try {
          await api.post('/auth/refresh-token');
          return api(originalRequest);
        } catch (refreshError) {
          if (typeof window !== 'undefined') {
            // Chỉ chuyển hướng đến trang login nếu không phải đang ở trang công khai
            if (!window.location.pathname.match(/\/(login|activate|forgot-password|reset-password)/)) {
              window.location.href = '/login';
            }
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
