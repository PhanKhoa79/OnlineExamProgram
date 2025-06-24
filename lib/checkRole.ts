import { cookies } from 'next/headers';
import { decode } from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import { cache } from 'react';

// Cache the role check to avoid repeated operations
const getRoleFromToken = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = decode(token);

    if (!decoded || typeof decoded !== 'object' || !('role' in decoded)) {
      return null;
    }

    // Kiểm tra token có hết hạn không
    if (typeof decoded === 'object' && 'exp' in decoded) {
      const exp = decoded.exp as number;
      if (Date.now() / 1000 >= exp) {
        return null; // Token hết hạn
      }
    }

    const roleObj = (decoded as { role?: { id: number; name: string } }).role;
    return roleObj || null;
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
});

export const checkUserRole = async (options?: { deny?: string[]; allow?: string[] }) => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value;
  
  const roleObj = await getRoleFromToken();

  // Nếu không có role nhưng vẫn có refresh token, redirect về login để middleware xử lý
  if (!roleObj) {
    if (refreshToken) {
      redirect('/login'); // Để middleware xử lý refresh token
    } else {
      redirect('/login'); // Không có token nào cả
    }
    return undefined as never;
  }

  // Nếu truyền allow, chỉ cho phép role nằm trong allow
  if (options?.allow && !options.allow.includes(roleObj.name)) {
    redirect('/for-bidden');
    return undefined as never;
  }

  // Nếu truyền deny, từ chối nếu role nằm trong danh sách
  if (options?.deny && options.deny.includes(roleObj.name)) {
    redirect('/for-bidden');
    return undefined as never;
  }

  return roleObj;
};
