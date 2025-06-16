export interface ActivityLogDto {
  id: number;
  action: string;
  module: string;
  targetName: string | null;
  description: string;
  displayMessage: string;
  createdAt: string;
  account: {
    id: number;
    accountname: string;
    email: string;
  };
}

export interface ActivityLogResponse {
  success: boolean;
  data: ActivityLogDto[];
  total?: number;
} 