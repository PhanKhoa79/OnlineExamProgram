import axios from 'axios';
import  { API_BASE_URL }  from './config';
import { setupInterceptors } from './interceptors';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(api);

export default api;
