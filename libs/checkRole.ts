import { cookies } from 'next/headers';
import { decode } from 'jsonwebtoken';
import { redirect } from 'next/navigation';

export const checkUserRole = async (allowedRoles: string[] = ['admin', 'teacher']) => {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) {
    redirect('/login');
    return;
  }

  // Giải mã token
  const decoded = decode(token);
  if (!decoded || typeof decoded !== 'object' || !('role' in decoded)) {
    redirect('/login');
    return;
  }

  const role = (decoded as { role?: string }).role;

  if (!allowedRoles.includes(role)) {
    redirect('/for-bidden');
    return;
  }

  return role;
};
