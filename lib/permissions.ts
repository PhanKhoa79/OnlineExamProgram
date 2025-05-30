export const hasResourcePermission = (permissions: string[], resource: string): boolean => {
  return permissions.some(p => p.startsWith(`${resource}:`));
};

export const hasPermission = (permissions: string[], permission: string): boolean => {
  return permissions.includes(permission);
};