export interface RoleWithPermissionsDto {
  id?: number,
  name: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleDto {
  name: string;
  permissions: string[];
}
