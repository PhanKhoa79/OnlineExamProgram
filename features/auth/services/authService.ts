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

export const forgotPassword = (email: string) => {
  return api.post('/auth/forgot-password', { email });
};

export const resetPassword = (code: string, newPassword: string) => {
  return api.post('/auth/reset-password', { code, newPassword });
};

export const verifyResetCode = (code: string) => {
  return api.post('/auth/verify-reset-code', { code });
};