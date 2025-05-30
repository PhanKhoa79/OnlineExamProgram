"use client";

import React, { useState, useEffect } from "react";
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
import { addAccount} from "../../services/accountService";
import { toast } from "@/components/hooks/use-toast";
import { schema, getErrorMessage } from "@/lib/validationAuth";
import AuthInput from "@/components/ui/AuthInput";
import {Email , Https, Person} from "@mui/icons-material";
import { useDispatch } from 'react-redux';
import { addAccount as addAccountAction } from '@/store/accountSlice';
import { CustomModal } from "@/components/ui/CustomModal";
import { getAllRolesWithPermissions } from "@/features/role/services/roleServices";
import { RoleWithPermissionsDto } from "@/features/role/types/role";

type AddAccountModalProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
};

export function AddAccountModal({ open, onOpenChange }: AddAccountModalProps) {
  const dispatch = useDispatch();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassWord] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
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
    const { emailError, passwordError, accountnameError } = getErrorMessage(schema, { email, password, accountname: name });
    setEmailError(emailError);
    setPasswordError(passwordError);
    setAccountnameError(accountnameError);
  }, [email, password, name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { emailError, passwordError, accountnameError } = getErrorMessage(schema, { email, password, accountname:name });
    setEmailError(emailError);
    setPasswordError(passwordError);
    setAccountnameError(accountnameError);
    if (emailError || passwordError || accountnameError) {
      setLoading(false);
      return;
    }
    try {
      const response = await addAccount({
        accountname: name,
        email,
        password,
        role,
        isActive,
        urlAvatar: avatarUrl,
      });
      const newAccount = {
        id: response.data.data.id,
        accountname: response.data.data.accountname,
        email: response.data.data.email,
        role: response.data.data.role.name,
        isActive: response.data.data.isActive,
        urlAvatar: response.data.data.urlAvatar
      };
      console.log("New account created:", newAccount);
      dispatch(addAccountAction(newAccount))
      toast({ title: 'Tạo tài khoản thành công!' })
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: err.response?.data?.message || 'Lỗi khi tạo tài khoản',
        variant: 'error',
      })
    } finally {
      setLoading(false);
    }
  }

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
      title="Thêm tài khoản"
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel="+ Thêm tài khoản"
    >

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
          id="email"
          title="Email"
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
          Icon={Email}
        />
      </div>

      <div className="flex flex-col gap-2 dark:text-black">
        <AuthInput
          id="password"
          title="Mật khẩu"
          type={showPassword ? "text" : "password"}
          label="Password"
          value={password}
          onChange={(e) => setPassWord(e.target.value)}
          error={passwordError}
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
            <Label htmlFor="status-active">Kích hoạt</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="inactive" id="status-inactive" className="dark:bg-black" />
            <Label htmlFor="status-inactive">Chưa kích hoạt</Label>
          </div>
        </RadioGroup>
      </div>

      <UploadAvatar onUpload={setAvatarUrl} />
    </CustomModal>
  );
}

