import { AxiosInstance } from 'axios';

export const setupInterceptors = (api: AxiosInstance) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {  
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await api.post('/auth/refresh-token');
          return api(originalRequest);
        } catch (refreshError) {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
