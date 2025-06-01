'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/store';
import { getStudentByEmail } from '@/features/student/services/studentService';
import { StudentInfoDto } from '@/features/student/types/student';
import { InfoItem } from '@/components/ui/InfoItem';
import { uploadAvatar } from '@/features/account/services/accountService';
import { toast } from '@/components/hooks/use-toast';
import { updateAccount } from '@/features/account/services/accountService';

export default function ProfilePage() {
  const [student, setStudent] = useState<StudentInfoDto | null>(null);
  const [loading, setLoading] = useState(true);

  const user = useAuthStore.getState().user;
  const accountname = user?.accountname;
  const email = user?.email;
  const urlAvatar = user?.urlAvatar;

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (!email) return;
        const res = await getStudentByEmail(email);
        setStudent(res);
      } catch (err) {
        console.error('Error fetching student:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    try {
        // 1. Upload ảnh lên server
        const url = await uploadAvatar(file);
        console.log(url);
        // 2. Gọi API update tài khoản
        await updateAccount(user.id, { urlAvatar: url });

        // 3. Cập nhật store để hiển thị ngay ảnh mới
        useAuthStore.getState().setAuthInfo({
        ...user,
        urlAvatar: `${url}?v=${Date.now()}`,
        });
        toast({title: 'Cập nhật ảnh đại diện thành công'});
    } catch (error) {
        toast({title: 'Cập nhật ảnh đại diện thất bại' ,variant: 'error'})
    }
    };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Thông tin cá nhân</h1>
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-6">
        <div className="flex gap-4">
          <div className="relative group w-24 h-24">
            <Image
              src={urlAvatar || '/avatar.png'}
              alt="Avatar"
              fill
              className="rounded-full object-cover border shadow"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-4.553a1.5 1.5 0 00-2.121-2.121L13 7.879m0 0L8.464 3.343a1.5 1.5 0 00-2.121 2.121L10.879 10m2.121 2.121L21 19.121M3 21h18"
                />
              </svg>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="ml-4 flex flex-col justify-center">
            <p className="text-xl font-semibold">{student?.fullName}</p>
            <p className="text-sm text-gray-500">{accountname}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-sm text-gray-700">
          <InfoItem label="Mã sinh viên" value={student?.studentCode} />
          <InfoItem label="Giới tính" value={student?.gender} />
          <InfoItem label="Ngày sinh" value={student?.dateOfBirth} />
          <InfoItem label="Email" value={email} />
          <InfoItem label="Số điện thoại" value={student?.phoneNumber} />
          <InfoItem label="Địa chỉ" value={student?.address} />
        </div>
      </div>
    </div>
  );
}
