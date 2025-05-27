export type Account = {
  accountname: string;
  password: string;
  email: string | null;
  role: 'student' | 'teacher' | 'admin';
  isActive: boolean;
  urlAvatar?: string | File;
};

export type AccountResponse = {
  id: number;
  accountname: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  isActive: boolean;
  urlAvatar: string | null;
};
