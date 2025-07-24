"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UploadAvatar } from "@/components/ui/UploadAvtar";
import { getAccountById, updateAccount } from "@/features/account/services/accountService";
import { toast } from "@/components/hooks/use-toast";
import { schema, getErrorMessage } from "@/lib/validationAuth";
import AuthInput from "@/components/ui/AuthInput";
import { Email, Https, Person, SaveOutlined, Info } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { updateAccount as updateAccountAction } from "@/store/accountSlice";
import { getAllRolesWithPermissions } from "@/features/role/services/roleServices";
import { RoleWithPermissionsDto } from "@/features/role/types/role";
import { useRouter } from "next/navigation";
import { AccountResponse } from "@/features/account/types/account";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavigableBreadcrumb } from "@/components/ui/NavigableBreadcrumb";
import { formatDateTime } from "@/lib/dateUtils";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function EditAccountPage({ id }: { id: number }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassWord] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentAccountData, setCurrentAccountData] = useState<{
    id: number;
    email: string;
    accountname: string;
    role: { name: string };
    isActive: boolean;
    urlAvatar?: string;
    createdAt?: string;
    updatedAt?: string;
  } | null>(null);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [accountnameError, setAccountnameError] = useState<string | null>(null);
  const [roles, setRoles] = useState<RoleWithPermissionsDto[]>([]);

  useEffect(() => {
    getAllRolesWithPermissions()
      .then(setRoles)
      .catch((error) => console.error("Failed to fetch roles:", error));
  }, []);

  useEffect(() => {
    if (roles.length > 0 && role === "" && id) {
      getAccountById(id).then((res) => {
        if (res) {
          const accountData = res.data;
          setCurrentAccountData(accountData);
          setName(accountData.accountname);
          setEmail(accountData.email);
          setIsActive(accountData.isActive);
          setAvatarUrl(accountData.urlAvatar || "");
          const matchedRole = roles.find((r) => r.name === accountData.role.name);
          if (matchedRole) {
            setRole(matchedRole.name);
          }
        }
      });
    }
  }, [roles, id, role]);

  useEffect(() => {
    const { emailError, accountnameError } = getErrorMessage(schema, {
      email,
      accountname: name,
    });
    setEmailError(emailError);
    setAccountnameError(accountnameError);
  }, [email, name]);

  const handleSubmit = async (exitAfterSave = false) => {
    setLoading(true);
    try {
      const updateData = {
        accountname: name,
        role,
        isActive,
        urlAvatar: avatarUrl,
        ...(password && { password }),
      };

      const response = await updateAccount(id, updateData);

      const updatedAccount: AccountResponse = {
        id: response.data.data.id,
        email: response.data.data.email,
        accountname: response.data.data.accountname,
        role: response.data.data.role.name,
        isActive: response.data.data.isActive,
        urlAvatar: response.data.data.urlAvatar,
        createdAt: response.data.data.createdAt || new Date().toISOString(),
        updatedAt: response.data.data.updatedAt || new Date().toISOString(),
      };

      setCurrentAccountData(response.data.data);

      dispatch(updateAccountAction(updatedAccount));

      toast({ title: "Cập nhật tài khoản thành công!" });
      if (exitAfterSave) {
        router.push("/dashboard/account");
      }
    } catch (err: unknown) {
      const apiError = err as ApiError;
      toast({
        title: apiError?.response?.data?.message || "Lỗi khi cập nhật tài khoản",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 px-6 py-4">
      <NavigableBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard", isHome: true },
          { label: "Tài khoản", href: "/dashboard/account" },
          { label: "Sửa tài khoản", isActive: true },
        ]}
      />

      <div className="text-center space-y-3 py-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg">
          <Person className="h-6 w-6" />
          <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa tài khoản</h1>
        </div>
        <p className="text-lg text-gray-600 font-medium">
          Chỉnh sửa tài khoản: <span className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">&quot;{currentAccountData?.accountname}&quot;</span>
        </p>
      </div>
      {/* Card form */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Thông tin tài khoản</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
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

          {/* Vai trò */}
          <div className="space-y-2">
            <Label htmlFor="role">Vai trò</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="-- Chọn vai trò --" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem value={role.name} key={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Trạng thái */}
          <div>
            <Label>Trạng thái</Label>
            <RadioGroup
              value={isActive ? "active" : "inactive"}
              onValueChange={(val) => setIsActive(val === "active")}
              className="flex space-x-6 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="status-active" />
                <Label htmlFor="status-active">Đã kích hoạt</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inactive" id="status-inactive" />
                <Label htmlFor="status-inactive">Chưa kích hoạt</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Avatar */}
          <div className="space-y-2">
            <Label>Ảnh đại diện</Label>
            <Image
              src={avatarUrl || "/avatar.png"}
              alt="avatar"
              width={124}
              height={124}
              className="rounded-full object-cover border"
            />
          </div>

          <UploadAvatar onUpload={setAvatarUrl} />
        </CardContent>
      </Card>

      {/* Thông tin chi tiết tài khoản */}
      {currentAccountData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Thông tin chi tiết tài khoản
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <Label className="font-semibold text-gray-600">ID tài khoản:</Label>
                <p className="text-gray-800">{currentAccountData.id}</p>
              </div>
              <div className="space-y-1">
                <Label className="font-semibold text-gray-600">Email:</Label>
                <p className="text-gray-800">{currentAccountData.email}</p>
              </div>
              <div className="space-y-1">
                <Label className="font-semibold text-gray-600">Tên tài khoản:</Label>
                <p className="text-gray-800">{currentAccountData.accountname}</p>
              </div>
              <div className="space-y-1">
                <Label className="font-semibold text-gray-600">Quyền:</Label>
                <p className="text-gray-800">{currentAccountData.role.name}</p>
              </div>
              <div className="space-y-1">
                <Label className="font-semibold text-gray-600">Trạng thái:</Label>
                <p className={`text-gray-800 ${currentAccountData.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {currentAccountData.isActive ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                </p>
              </div>
              <div className="space-y-1">
                <Label className="font-semibold text-gray-600">Avatar:</Label>
                <p className="text-gray-800">{currentAccountData.urlAvatar ? 'Có' : 'Mặc định'}</p>
              </div>
              {currentAccountData.createdAt && (
                <div className="space-y-1">
                  <Label className="font-semibold text-gray-600">Ngày tạo:</Label>
                  <p className="text-gray-800">{formatDateTime(currentAccountData.createdAt)}</p>
                </div>
              )}
              {currentAccountData.updatedAt && (
                <div className="space-y-1">
                  <Label className="font-semibold text-gray-600">Cập nhật lần cuối:</Label>
                  <p className="text-gray-800">{formatDateTime(currentAccountData.updatedAt)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

        <div className="flex items-center justify-end">
            <div className="flex items-center space-x-2">
                <Button onClick={() => handleSubmit(false)} disabled={loading} className="cursor-pointer bg-blue-600 hover:bg-blue-400">
                    <SaveOutlined />
                    Lưu
                </Button>
                <Button variant="secondary" onClick={() => handleSubmit(true)} disabled={loading} className="cursor-pointer">
                    Lưu & Thoát
                </Button>
            </div>
        </div>
    </div>
  );
}

