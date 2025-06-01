'use client'

import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { AccountCircle, ExitToApp, Settings } from '@mui/icons-material';
import { logout } from '@/features/auth/services/authService'; 
import { useAuthStore } from '@/features/auth/store';
import Link from 'next/link';

export default function ProfileAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const { clearAuthInfo } = useAuthStore.getState();

  const role = useAuthStore.getState().user?.role.name;
  const accountName = useAuthStore.getState().user?.accountname;

  const urlAvatar = useAuthStore.getState().user?.urlAvatar;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();      
      clearAuthInfo();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="relative dark:text-black">
      <div className="flex items-center gap-1.5 cursor-pointer" onClick={toggleDropdown}>
        <Avatar alt="Avatar" src={urlAvatar || "/avatar.png"} sx={{ width: 50, height: 50 }} />
        <ArrowDropDown className="text-[#4A3AFF]" />
      </div>

      {isOpen && (
        <div className="flex flex-col justify-center gap-y-4 absolute right-0 mt-2 w-60 bg-white shadow-xl rounded-md p-4 z-50">
          
          {/* Tên người dùng */}
          <div className="flex flex-wrap items-center gap-2 p-2 cursor-default border-b border-gray-300">
            <Avatar alt="Avatar" src={urlAvatar || "/avatar.png"} sx={{ width: 30, height: 30 }} />
            <span>{accountName}</span>
          </div>

          {/* Các tùy chọn */}
          {role === "student" && (
            <>
              <Link href="/account/profile">
                <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100">
                  <AccountCircle className="text-gray-600" />
                  <span>Thông tin cá nhân</span>
                </div>
              </Link>

              <Link href="/account/security">
                <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100">
                  <Settings className="text-gray-600" />
                  <span>Đổi mật khẩu</span>
                </div>
              </Link>
            </>
          )}

          <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-red-500 hover:text-white" onClick={handleLogout}>
            <ExitToApp />
            <span>Đăng xuất</span>
          </div>
        </div>
      )}
    </div>
  );
}
