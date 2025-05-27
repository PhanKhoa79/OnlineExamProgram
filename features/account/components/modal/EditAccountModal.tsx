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
import { schema, getErrorMessage } from "@/libs/validationAuth";
import AuthInput from "@/components/ui/AuthInput";
import {Email , Https, Person} from "@mui/icons-material";
import { useDispatch } from 'react-redux';
import { updateAccount as updateAccountAction } from '@/store/accountSlice';
import { updateAccount } from '@/features/account/services/accountService';

interface EditAccountModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
}

export const EditAccountModal = ({ open, setOpen, id }: EditAccountModalProps) => {
    const dispatch = useDispatch();

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassWord] = useState<string>("");
    const [role, setRole] = useState<"" | "admin" | "teacher" | "student">("");
    const [isActive, setIsActive] = useState<boolean>(false);
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const [emailError, setEmailError] = useState<string | null>(null);
    const [accountnameError, setAccountnameError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

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
                role: response.data.data.role,
                isActive: response.data.data.isActive,
                urlAvatar: response.data.data.urlAvatar
            };
            dispatch(updateAccountAction(newAccount))
            toast({ title: 'Account updated successfully!' })
            setOpen(false);
        } catch (err: any) {
            toast({
            title: err.response?.data?.message || 'Error update account',
            variant: 'error',
            })
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            const res = await getAccountById(id);
            if (res) {
                setName(res.data.accountname);
                setEmail(res.data.email);
                setRole(res.data.role);
                setIsActive(res.data.isActive);
                setAvatarUrl(res.data.urlAvatar || '');
            } else {
                toast({
                    title: "Error",
                    description: "Failed to fetch account data",
                    variant: "error",
                });
            }
        })();
    }, [id]);

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
        setOpen={setOpen}
        title="Edit Account"
        onSubmit={handleSubmit}
        submitLabel="Update Account"
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
                title="Username"
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
                title="Password"
                type={showPassword ? "text" : "password"}
                label="Leave blank to keep current password"
                value={password}
                onChange={(e) => setPassWord(e.target.value)}
                Icon={Https}
                showPasswordToggle={() => setShowPassword(!showPassword)}
                />
            </div>

            <div className="flex flex-col gap-2 dark:text-black">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role" className="w-[180px] font-semibold dark:bg-white dark:hover:bg-gray-300">
                    <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-2 dark:text-black">
                <Label>Status</Label>
                <RadioGroup
                value={isActive ? "active" : "inactive"}
                onValueChange={(val: "active" | "inactive") => setIsActive(val === "active")}
                className="flex space-x-4"
                >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="status-active" className="dark:bg-black" />
                    <Label htmlFor="status-active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inactive" id="status-inactive" className="dark:bg-black" />
                    <Label htmlFor="status-inactive">Inactive</Label>
                </div>
                </RadioGroup>
            </div>

            <div className="flex flex-col gap-2 dark:text-black">
                <Label>Avatar</Label>
                <Image src={avatarUrl || "/avatar.png"} alt="avatar" width={72} height={72} className="rounded-full object-cover border-black border-1" />
            </div>
            <UploadAvatar onUpload={setAvatarUrl} />
        </CustomModal>
    );
};
export default EditAccountModal;
