import api from 'libs/axios';

export const login = (email: string, password: string) => {
  return api.post('/auth/login', { email, password });
};

export const logout = () => {
  return api.post('/auth/logout');
};
