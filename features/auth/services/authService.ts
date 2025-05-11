import api from 'libs/axios';

export const login = (email: string, password: string) => {
  return api.post('/auth/login', { email, password });
};

export const logout = () => {
  return api.post('/auth/logout');
};

export const activate = (
  token: string,
  tempPassword: string,
  newPassword: string,
) => {
  return api.post('/account/activate', {
    token,
    tempPassword,
    newPassword,
  });
};
