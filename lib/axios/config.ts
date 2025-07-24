// Cấu hình API URL cho client và server
const getApiUrl = () => {
  // Nếu đang chạy trên browser (client-side)
  if (typeof window !== 'undefined') {
    // Browser luôn phải dùng localhost vì không thể truy cập container name
    return process.env.NEXT_PUBLIC_API_URL_BROWSER || 'http://localhost:5000/api';
  }
  
  // Nếu đang chạy trên server (server-side rendering)
  // Kiểm tra xem có đang chạy trong Docker không
  const isDocker = process.env.NODE_ENV === 'production';
  
  if (isDocker) {
    // Trong Docker, server có thể dùng container name
    return 'http://nestjs-api:5000/api';
  } else {
    // Development, dùng localhost
    return 'http://localhost:5000/api';
  }
};

export const API_BASE_URL = getApiUrl();
