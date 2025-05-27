import api from '@/libs/axios';
import { Account, AccountResponse } from '@/features/account/types/account';
import { log } from 'console';

export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);


  const response = await api.post<{ url: string }>('/upload-avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }, 
  });
  return response.data.url;
};
export const addAccount = async (data: Account) => {
  return api.post('/account/add/user', data);
};

export const addAccountsForStudents = async (data: Partial<Account>[]) => {
  return api.post('/account/add/users', data);
};
export const getAllAccounts = async (): Promise<AccountResponse[]> => {
  const response = await api.get<AccountResponse[]>('/account/all');
  return response.data;
};

export const deleteAccount = async (id: number) => {
  return api.delete(`/account/${id}`);
};

export const deleteManyAccounts = async (ids: number[]) => {
  return api.post('/account/delete-many', { ids });
};

export const getAccountById = async (id: number) => {
  return api.get(`/account/${id}`);
};

export const updateAccount = async (id: number, data: Partial<Account>) => {
  return api.put(`/account/${id}`, data);
};

export const exportAccounts = async (accounts: AccountResponse[], format: 'excel' | 'csv') => {
  const response = await api.post(
    `/account/export?format=${format}`,
    { accounts },
    {
      responseType: "blob",
    }
  );

  const fileName = `accounts.${format === 'excel' ? 'xlsx' : 'csv'}`;

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const importAccountsFromFile = async (file: File, type: 'xlsx' | 'csv') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await api.post(`/account/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const downloadTemplateFile = async (type: 'xlsx' | 'csv') => {
  try {
    const response = await api.get(`/account/download-template?type=${type}`, {
      responseType: 'blob', 
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = url;

    const fileName = `account_template.${type}`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Lỗi khi tải file mẫu:', error);
    throw error;
  }
};