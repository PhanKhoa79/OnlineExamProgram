import { PlusCircle, Eye, PenLine, Trash2 } from 'lucide-react';
import React from 'react';

export const getPermissionClass = (permission: string) => {
  const action = permission.split(':')[1];
  const colorMap: Record<string, string> = {
    create: 'bg-green-100 text-green-700',
    view: 'bg-sky-100 text-sky-700',
    update: 'bg-yellow-100 text-yellow-700',
    delete: 'bg-red-100 text-red-700',
  };
  return colorMap[action] || 'bg-gray-100 text-gray-800';
};


export const getPermissionIcon = (permission: string) => {
  const action = permission.split(':')[1];
  switch (action) {
    case 'create':
      return <PlusCircle className="w-3 h-3" />;
    case 'view':
      return <Eye className="w-3 h-3" />;
    case 'update':
      return <PenLine className="w-3 h-3" />;
    case 'delete':
      return <Trash2 className="w-3 h-3" />;
    default:
      return null;
  }
};
