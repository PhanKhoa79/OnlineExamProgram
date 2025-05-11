'use client'

import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material';
import { AccountCircle, ExitToApp, Settings } from '@mui/icons-material';
import { logout } from '../../features/auth/services/authService'; 

export default function ProfileAvatar() {
   const [isOpen, setIsOpen] = useState(false);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    const handleLogout = async () => {
      try {
        await logout();      
        window.location.href = '/login';
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };

  return (
    <div className="relative z-999 dark:text-black">
      <div className="flex items-center gap-1.5 cursor-pointer" onClick={toggleDropdown}>
        <Avatar alt="Avatar" src="/avatar.png" sx={{ width: 50, height: 50 }} />
        <ArrowDropDown className="text-[#4A3AFF]" />
      </div>
      {isOpen && (
        <div className="flex flex-col justify-center gap-y-4 absolute right-0 mt-2 w-60 bg-white shadow-xl rounded-md p-4">
          <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 border-b border-gray-300">
            <Avatar alt="Avatar" src="/avatar.png" sx={{ width: 30, height: 30 }} />
            <span>James Aldrino</span>
          </div>
          <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200">
            <AccountCircle className="text-gray-600" />
            <span>Thông tin cá nhân</span>
          </div>
          <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200">
            <Settings className="text-gray-600" />
            <span>Đổi mật khẩu</span>
          </div>
          <div className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-200" onClick={handleLogout}>
            <ExitToApp className="text-gray-600" />
            <span>Đăng xuất</span>
          </div>
        </div>
      )}
    </div>
  )
}
