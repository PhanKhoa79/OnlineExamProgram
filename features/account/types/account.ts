export type Account = {
  accountname: string;
  password: string;
  email: string | null;
  role: string;
  isActive: boolean;
  urlAvatar?: string | File;
};

export type AccountResponse = {
  id: number;
  accountname: string;
  email: string;
  role: string;
  isActive: boolean;
  urlAvatar: string | null;
  createdAt: string;
  updatedAt: string;
};

