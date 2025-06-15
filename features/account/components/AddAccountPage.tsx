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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UploadAvatar } from "@/components/ui/UploadAvtar";
import { addAccount } from "../services/accountService";
import { toast } from "@/components/hooks/use-toast";
import { schema, getErrorMessage } from "@/lib/validationAuth";
import AuthInput from "@/components/ui/AuthInput";
import { Email, Https, Person, SaveOutlined } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { addAccount as addAccountAction } from "@/store/accountSlice";
import { getAllRolesWithPermissions } from "@/features/role/services/roleServices";
import { RoleWithPermissionsDto } from "@/features/role/types/role";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavigableBreadcrumb } from "@/components/ui/NavigableBreadcrumb";
import { useRouter } from "next/navigation";
import { AccountResponse } from "../types/account";

// Type for API error response
interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

export default function AddAccountPage() {
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

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [accountnameError, setAccountnameError] = useState<string | null>(null);
  const [roles, setRoles] = useState<RoleWithPermissionsDto[]>([]);

  useEffect(() => {
    getAllRolesWithPermissions()
      .then(setRoles)
      .catch((error) => console.error("Failed to fetch roles:", error));
  }, []);

  useEffect(() => {
    const { emailError, passwordError, accountnameError } = getErrorMessage(schema, {
      email,
      password,
      accountname: name,
    });
    setEmailError(emailError);
    setPasswordError(passwordError);
    setAccountnameError(accountnameError);
  }, [email, password, name]);

  const handleSubmit = async (exitAfterSave = false) => {
    setLoading(true);
    const { emailError, passwordError, accountnameError } = getErrorMessage(schema, {
      email,
      password,
      accountname: name,
    });

    if (emailError || passwordError || accountnameError) {
      setEmailError(emailError);
      setPasswordError(passwordError);
      setAccountnameError(accountnameError);
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
        urlAvatar: response.data.data.urlAvatar,
      };

      dispatch(addAccountAction(newAccount as AccountResponse));
      toast({ title: "Tạo tài khoản thành công!" });

      if (exitAfterSave) {
        router.push("/dashboard/account");
      } else {
        router.push(`/dashboard/account/edit/${newAccount.id}`);
      }
    } catch (error: unknown) {
      console.error("Error creating account:", error);
      
      let errorMessage = "Lỗi khi tạo tài khoản";
      
      // Type assertion for error handling
      const apiError = error as ApiError;
      
      // Extract error message from different possible structures
      if (apiError?.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      } else if (apiError?.response?.data?.error) {
        errorMessage = apiError.response.data.error;
      } else if (apiError?.message) {
        errorMessage = apiError.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Lỗi khi tạo tài khoản",
        description: errorMessage,
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 px-6 py-4">
      {/* Breadcrumb */}
      <NavigableBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard", isHome: true },
          { label: "Tài khoản", href: "/dashboard/account" },
          { label: "Thêm tài khoản", isActive: true },
        ]}
      />

      <div className="text-center space-y-3 py-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg">
          <Person className="h-6 w-6" />
          <h1 className="text-2xl font-bold tracking-tight">Thêm tài khoản mới</h1>
        </div>
        <p className="text-lg text-gray-600 font-medium">
          Tạo tài khoản mới với <span className="text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">các thông tin cần thiết</span>
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin tài khoản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
            id="email"
            title="Email"
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            Icon={Email}
          />

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

          {/* Vai trò */}
          <div>
            <Label htmlFor="role">Vai trò</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full mt-2">
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
                <Label htmlFor="status-active">Kích hoạt</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inactive" id="status-inactive" />
                <Label htmlFor="status-inactive">Chưa kích hoạt</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Avatar */}
          <UploadAvatar onUpload={setAvatarUrl} />
        </CardContent>
      </Card>

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
