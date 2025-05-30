'use client';

import React, { useState, useEffect } from 'react';
import { CustomModal } from '@/components/ui/CustomModal';
import Image from 'next/image';
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { UploadAvatar } from "@/components/ui/UploadAvtar";
import { getAccountById } from "../../services/accountService";
import { toast } from "@/components/hooks/use-toast";
import { schema, getErrorMessage } from "@/lib/validationAuth";
import AuthInput from "@/components/ui/AuthInput";
import {Email , Https, Person} from "@mui/icons-material";
import { useDispatch } from 'react-redux';
import { updateAccount as updateAccountAction } from '@/store/accountSlice';
import { updateAccount } from '@/features/account/services/accountService';
import { getAllRolesWithPermissions } from "@/features/role/services/roleServices";
import { RoleWithPermissionsDto } from "@/features/role/types/role";

interface EditAccountModalProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  id: number;
}

export const EditAccountModal = ({ open, onOpenChange, id }: EditAccountModalProps) => {
    const dispatch = useDispatch();

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassWord] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [isActive, setIsActive] = useState<boolean>(false);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const [emailError, setEmailError] = useState<string | null>(null);
    const [accountnameError, setAccountnameError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const [roles, setRoles] = useState<RoleWithPermissionsDto[]>([]);

    useEffect(() => {
          const fetchRoles = async () => {
            try {
              const data = await getAllRolesWithPermissions();
              setRoles(data);
            } catch (error) {
              console.error('Failed to fetch roles:', error);
            }
          };
    
          fetchRoles();
      }, []);

      
    useEffect(() => {
        if (roles.length > 0 && role === '' && id) {
            getAccountById(id).then(res => {
            if (res) {
                setName(res.data.accountname);
                setEmail(res.data.email);
                setIsActive(res.data.isActive);
                setAvatarUrl(res.data.urlAvatar || '');
                const matchedRole = roles.find(r => r.name === res.data.role.name);
                if (matchedRole) {
                setRole(matchedRole.name);
                }
            }
            });
        }
    }, [roles, id]);
    
    useEffect(() => {
        const { emailError, accountnameError } = getErrorMessage(schema, { email, accountname: name });
        setEmailError(emailError);
        setAccountnameError(accountnameError);
    }, [email, name]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updateData: any = {
                accountname: name,
                role,
                isActive,
                urlAvatar: avatarUrl,
                };
            if (password) {
                updateData.password = password;
            }

            const response = await updateAccount(id, updateData);
            
            const newAccount = {
                id: response.data.data.id,
                email: response.data.data.email,    
                accountname: response.data.data.accountname,
                role: response.data.data.role.name,
                isActive: response.data.data.isActive,
                urlAvatar: response.data.data.urlAvatar
            };
            dispatch(updateAccountAction(newAccount))
            toast({ title: 'Cập nhật tài khoản thành công!' })
            onOpenChange(false);
        } catch (err: any) {
            toast({
            title: err.response?.data?.message || 'Lỗi khi cập nhật tài khoản',
            variant: 'error',
            })
        } finally {
            setLoading(false);
        }
    };

     useEffect(() => {
      if (!open) {
        setName("");
        setEmail("");
        setPassWord("");
        setRole("");
        setIsActive(true);
      }
    }, [open]);

    return (
        <CustomModal
        open={open}
        setOpen={onOpenChange}
        title="Cập nhật tài khoản"
        onSubmit={handleSubmit}
        submitLabel="Cập nhật tài khoản"
        loading={loading}
        >
            <div className="flex flex-col gap-2 dark:text-black">
                <AuthInput
                id="email"
                title="Email"
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                Icon={Email}
                disabled
                />
            </div>

            <div className="flex flex-col gap-2 dark:text-black">
                <AuthInput
                id="name"
                title="Tên tài khoản"
                type="text"
                label="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={accountnameError}
                Icon={Person}
                />
            </div>

            <div className="flex flex-col gap-2 dark:text-black">
                <AuthInput
                id="password"
                title="Mật khẩu"
                type={showPassword ? "text" : "password"}
                label="Để trống để giữ mật khẩu hiện tại"
                value={password}
                onChange={(e) => setPassWord(e.target.value)}
                Icon={Https}
                showPasswordToggle={() => setShowPassword(!showPassword)}
                />
            </div>

            <div className="flex flex-col gap-2 dark:text-black">
                <Label htmlFor="role">Quyền</Label>
                <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role" className="w-[180px] font-semibold dark:bg-white dark:hover:bg-gray-300">
                    <SelectValue placeholder="-- Chọn quyền --" />
                </SelectTrigger>
                <SelectContent>
                    {roles.map((role) => (
                        <SelectItem value={role.name} key={role.name}>{role.name}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-2 dark:text-black">
                <Label>Trạng thái</Label>
                <RadioGroup
                value={isActive ? "active" : "inactive"}
                onValueChange={(val: "active" | "inactive") => setIsActive(val === "active")}
                className="flex space-x-4"
                >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="status-active" className="dark:bg-black" />
                    <Label htmlFor="status-active">Đã kích hoạt</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inactive" id="status-inactive" className="dark:bg-black" />
                    <Label htmlFor="status-inactive">Chưa kích hoạt</Label>
                </div>
                </RadioGroup>
            </div>

            <div className="flex flex-col gap-2">
                <Label>Ảnh đại diện</Label>
                <Image src={avatarUrl || "/avatar.png"} alt="avatar" width={124} height={72} className="rounded-full object-cover" />
            </div>
            <UploadAvatar onUpload={setAvatarUrl} />
        </CustomModal>
    );
};
export default EditAccountModal;
