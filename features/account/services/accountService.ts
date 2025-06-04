import api from '@/lib/axios';
import { Account, AccountResponse } from '@/features/account/types/account';

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
  return api.get(`/account/info/${id}`);
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

  const blob = new Blob([response.data], {
    type:
      format === "excel"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv",
  });

  const options = {
    suggestedName: `accounts.${format === 'excel' ? 'xlsx' : 'csv'}`,
    types: [
      {
        description: format === 'excel' ? 'Excel Files' : 'CSV Files',
        accept: {
          [format === 'excel'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'text/csv']: [format === 'excel' ? '.xlsx' : '.csv'],
        },
      },
    ],
  };

  if ('showSaveFilePicker' in window) {
    const handle = await (window as unknown as { 
      showSaveFilePicker: (options: {
        suggestedName: string;
        types: Array<{
          description: string;
          accept: Record<string, string[]>;
        }>;
      }) => Promise<{
        createWritable: () => Promise<{
          write: (data: Blob) => Promise<void>;
          close: () => Promise<void>;
        }>;
      }>;
    }).showSaveFilePicker(options);
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
  }
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