"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import AuthInput from "@/components/ui/AuthInput";
import { Person, School, Phone, Email, Home, Cake, SaveOutlined } from "@mui/icons-material";
import { createStudent } from "../services/studentService";
import { getAllClasses } from "@/features/classes/services/classServices";
import { ClassResponseDto } from "@/features/classes/types/class.type";
import { getStudentErrorMessage } from "../utils/validation";
import { CreateStudentDto } from "../types/student";
import { toast } from '@/components/hooks/use-toast';
import { addStudent } from "@/store/studentSlice";
import { NavigableBreadcrumb } from "@/components/ui/NavigableBreadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export function AddStudentPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<CreateStudentDto>({
    studentCode: "",
    fullName: "",
    gender: "Nam",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    address: "",
    classId: 0,
  });

  const [errors, setErrors] = useState({
    studentCodeError: null as string | null,
    fullNameError: null as string | null,
    genderError: null as string | null,
    dateOfBirthError: null as string | null,
    phoneNumberError: null as string | null,
    emailError: null as string | null,
    addressError: null as string | null,
    classIdError: null as string | null,
  });

  const [classes, setClasses] = useState<ClassResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoading(true);
        const data = await getAllClasses();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách lớp học",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleInputChange = (field: keyof CreateStudentDto, value: string | number) => {
    // Special handling for phone number - only allow digits
    if (field === 'phoneNumber' && typeof value === 'string') {
      // Remove all non-digit characters
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [field]: numericValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    const errorField = `${field}Error` as keyof typeof errors;
    if (errors[errorField]) {
      setErrors(prev => ({
        ...prev,
        [errorField]: null
      }));
    }
  };

  const validateForm = () => {
    const validationErrors = getStudentErrorMessage(formData);
    setErrors(validationErrors);
    
    return Object.values(validationErrors).every(error => error === null);
  };

  const handleSubmit = async (exitAfterSave = false) => {
    if (!validateForm()) {
      toast({
        title: "Lỗi validation",
        description: "Vui lòng kiểm tra lại thông tin",
        variant: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createStudent(formData);
      dispatch(addStudent(response));
      toast({
        title: "Thành công",
        description: "Thêm sinh viên mới thành công!",
      });
      
      if (exitAfterSave) {
        router.push("/dashboard/student");
      } else {
        router.push(`/dashboard/student/edit/${response.id}`);
      }
      
      // Reset form
      setFormData({
        studentCode: "",
        fullName: "",
        gender: "Nam",
        dateOfBirth: "",
        phoneNumber: "",
        email: "",
        address: "",
        classId: 0,
      });
    } catch (error: unknown) {
      console.error("Error creating student:", error);
      
      let errorMessage = "Có lỗi xảy ra khi thêm sinh viên";
      
      const apiError = error as ApiError;

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
        title: "Lỗi",
        description: errorMessage,
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 px-6 py-4">
      {/* Breadcrumb */}
      <NavigableBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard", isHome: true },
          { label: "Sinh viên", href: "/dashboard/student" },
          { label: "Thêm sinh viên", isActive: true },
        ]}
      />

      <div className="text-center space-y-3 py-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg">
          <Person className="h-6 w-6" />
          <h1 className="text-2xl font-bold tracking-tight">Thêm sinh viên mới</h1>
        </div>
        <p className="text-lg text-gray-600 font-medium">
          Tạo sinh viên mới với <span className="text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">các thông tin cần thiết</span>
        </p>
      </div>

      {/* Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Tạo sinh viên mới</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Mã sinh viên */}
          <AuthInput
            id="studentCode"
            title="Mã sinh viên"
            type="text"
            label="Student Code"
            value={formData.studentCode}
            onChange={(e) => handleInputChange("studentCode", e.target.value)}
            Icon={School}
            error={errors.studentCodeError}
          />

          {/* Họ và tên */}
          <AuthInput
            id="fullName"
            title="Họ và tên"
            type="text"
            label="Full Name"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            Icon={Person}
            error={errors.fullNameError}
          />

          {/* Giới tính */}
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-bold text-black-700 dark:text-white">
              Giới tính <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value as "Nam" | "Nữ" | "Khác")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
            {errors.genderError && (
              <span className="text-red-500 text-sm">{errors.genderError}</span>
            )}
          </div>

          {/* Ngày sinh */}
          <AuthInput
            id="dateOfBirth"
            title="Ngày sinh"
            type="date"
            label="Date of Birth"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            Icon={Cake}
            error={errors.dateOfBirthError}
          />

          {/* Số điện thoại */}
          <AuthInput
            id="phoneNumber"
            title="Số điện thoại"
            type="tel"
            label="Phone Number"
            value={formData.phoneNumber || ""}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            Icon={Phone}
            error={errors.phoneNumberError}
            placeholder="Nhập số điện thoại (VD: 0123456789)"
            maxLength={11}
          />

          {/* Email */}
          <AuthInput
            id="email"
            title="Email"
            type="email"
            label="Email"
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            Icon={Email}
            error={errors.emailError}
          />

          {/* Địa chỉ */}
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-bold text-black-700 dark:text-white">
              <Home className="inline mr-2" />
              Địa chỉ
            </label>
            <textarea
              value={formData.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
              rows={3}
              placeholder="Nhập địa chỉ..."
            />
            {errors.addressError && (
              <span className="text-red-500 text-sm">{errors.addressError}</span>
            )}
          </div>

          {/* Lớp học */}
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-bold text-black-700 dark:text-white">
              Lớp học <span className="text-red-500">*</span>
            </label>
            {isLoading ? (
              <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100">
                Đang tải danh sách lớp...
              </div>
            ) : (
              <select
                value={formData.classId}
                onChange={(e) => handleInputChange("classId", parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value={0}>Chọn lớp học</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.code} - {cls.name}
                  </option>
                ))}
              </select>
            )}
            {errors.classIdError && (
              <span className="text-red-500 text-sm">{errors.classIdError}</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => handleSubmit(false)} 
            disabled={isSubmitting} 
            className="cursor-pointer bg-blue-600 hover:bg-blue-400"
          >
            <SaveOutlined />
            Lưu
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleSubmit(true)} 
            disabled={isSubmitting} 
            className="cursor-pointer"
          >
            Lưu & Thoát
          </Button>
        </div>
      </div>
    </div>
  );
} 