import api from '@/lib/axios';

export const login = async (email: string, password: string) => {
  return await api.post('/auth/login', { email, password });
};

export const logout = async () => {
  return await api.post('/auth/logout');
};

export const activate = async (
  token: string,
  tempPassword: string,
  newPassword: string,
) => {
  return await api.post('/account/activate', {
    token,
    tempPassword,
    newPassword,
  });
};

export const verifyActivationToken = async (token: string) => {
  return await api.get(`/auth/verify-activation-token/${token}`);
};

export const resendActivationLink = async (email: string) => {
  return await api.post('/auth/resend-activation', { email });
};

export const requestActivation = async (email: string) => {
  return await api.post('/auth/request-activation', { email });
};

export const getEmailByActivationToken = async (token: string) => {
  return await api.get(`/auth/find-email-by-token/${token}`);
};

export const forgotPassword = async (email: string) => {
  return await api.post('/auth/forgot-password', { email });
};

export const resetPassword = async (code: string, newPassword: string) => {
  return await api.post('/auth/reset-password', { code, newPassword });
};

export const verifyResetCode = async (code: string) => {
  return await api.post('/auth/verify-reset-code', { code });
};

export const getLoginHistoryByAccountId = async (accountId: number) => {
  return await api.get(`/auth/login-history/${accountId}`);
};

export const changePassword = async (
  oldPassword: string,
  newPassword: string,
) => {
  return await api.post('/auth/change-password', {
    oldPassword,
    newPassword,
  });
};