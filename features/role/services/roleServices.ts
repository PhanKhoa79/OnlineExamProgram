import api from '@/lib/axios';
import { RoleWithPermissionsDto, CreateRoleDto } from '@/features/role/types/role'; 

export const getAllRolesWithPermissions = async (): Promise<RoleWithPermissionsDto[]> => {
  const response = await api.get<RoleWithPermissionsDto[]>('/role');
  return response.data;
};

export const getAllPermissions = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/role/permissions/all');
  return response.data.map(permission => permission.trim());
};

export const createRoleWithPermissions = async (role: CreateRoleDto) => {
  const response = await api.post<RoleWithPermissionsDto>('/role', role);
  return response;
};

export const getRoleByName = async (name: string) => {
  const response = await api.get(`/role/name/${encodeURIComponent(name)}`);
  return response.data;
};

export const getPermissionsByRoleId = async (id: number): Promise<RoleWithPermissionsDto> => {
  const response = await api.get<RoleWithPermissionsDto>(`/role/${id}/permissions`);
  return response.data;
};

export const updateRolePermissions = async (id: number, permissions: string[]) => {
  const response = await api.put(`/role/${id}/permissions`, { permissions });
  return response.data;
};

export const deleteRoleById = async (id: number) => {
  const response = await api.delete(`/role/${id}`);
  return response.data;
};