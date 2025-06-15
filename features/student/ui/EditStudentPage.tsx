"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import AuthInput from "@/components/ui/AuthInput";
import { Person, School, Phone, Email, Home, Cake, SaveOutlined } from "@mui/icons-material";
import { getStudentById, updateStudent } from "../services/studentService";
import { getAllClasses } from "@/features/classes/services/classServices";
import { ClassResponseDto } from "@/features/classes/types/class.type";
import { getStudentErrorMessage } from "../utils/validation";
import { UpdateStudentDto, StudentDto } from "../types/student";
import { toast } from '@/components/hooks/use-toast';
import { updateStudent as updateStudentStore } from "@/store/studentSlice";
import { NavigableBreadcrumb } from "@/components/ui/NavigableBreadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/dateUtils";

interface EditStudentPageProps {
  id: number;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

export function EditStudentPage({ id }: EditStudentPageProps) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [studentData, setStudentData] = useState<StudentDto | null>(null);
  const [formData, setFormData] = useState<UpdateStudentDto>({
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [studentResponse, classesResponse] = await Promise.all([
          getStudentById(id),
          getAllClasses()
        ]);

        setStudentData(studentResponse);
        setClasses(classesResponse);

        // Set form data with existing student data
        setFormData({
          studentCode: studentResponse.studentCode,
          fullName: studentResponse.fullName,
          gender: studentResponse.gender || "Nam",
          dateOfBirth: studentResponse.dateOfBirth || "",
          phoneNumber: studentResponse.phoneNumber || "",
          email: studentResponse.email || "",
          address: studentResponse.address || "",
          classId: studentResponse.classId || 0,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin sinh viên",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleInputChange = (field: keyof UpdateStudentDto, value: string | number) => {
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
    const validationData = {
      studentCode: formData.studentCode || "",
      fullName: formData.fullName || "",
      gender: formData.gender || "Nam",
      dateOfBirth: formData.dateOfBirth || "",
      phoneNumber: formData.phoneNumber || "",
      email: formData.email || "",
      address: formData.address || "",
      classId: formData.classId || 0,
    };

    const validationErrors = getStudentErrorMessage(validationData);
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
      const response = await updateStudent(id, formData);
      console.log("Update response:", response); // Debug log
      
      dispatch(updateStudentStore(response));
      
      // Fetch lại data để đảm bảo có thông tin mới nhất
      const updatedStudentData = await getStudentById(id);
      setStudentData(updatedStudentData);
      
      toast({
        title: "Thành công",
        description: "Cập nhật thông tin sinh viên thành công!",
      });
      
      if (exitAfterSave) {
        router.push("/dashboard/student");
      }
    } catch (error: unknown) {
      console.error("Error updating student:", error);
      
      let errorMessage = "Có lỗi xảy ra khi cập nhật sinh viên";
      
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

  if (isLoading) {
    return (
      <div className="space-y-6 px-6 py-4">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 py-4">
      {/* Breadcrumb */}
      <NavigableBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard", isHome: true },
          { label: "Sinh viên", href: "/dashboard/student" },
          { label: "Chỉnh sửa sinh viên", isActive: true },
        ]}
      />

      <div className="text-center space-y-3 py-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg">
          <Person className="h-6 w-6" />
          <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa sinh viên</h1>
        </div>
        <p className="text-lg text-gray-600 font-medium">
          Chỉnh sửa sinh viên: <span className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">&quot;{studentData?.fullName}&quot;</span>
        </p>
      </div>

      {/* Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>
            Thông tin sinh viên
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Mã sinh viên */}
          <AuthInput
            id="studentCode"
            title="Mã sinh viên"
            type="text"
            label="Student Code"
            value={formData.studentCode || ""}
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
            value={formData.fullName || ""}
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
              value={formData.gender || "Nam"}
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
            value={formData.dateOfBirth || ""}
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
            <select
              value={formData.classId || 0}
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
            {errors.classIdError && (
              <span className="text-red-500 text-sm">{errors.classIdError}</span>
            )}
          </div>

          {/* Thông tin sinh viên hiện tại */}
          {studentData && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Person className="w-5 h-5" />
                Thông tin sinh viên hiện tại
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border">
                    <span className="font-medium text-gray-600 dark:text-gray-400">ID:</span>
                    <span className="text-gray-900 dark:text-white">{studentData.id}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Mã sinh viên:</span>
                    <span className="text-gray-900 dark:text-white font-mono">{studentData.studentCode}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Họ và tên:</span>
                    <span className="text-gray-900 dark:text-white">{studentData.fullName}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Giới tính:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${studentData.gender === 'Nam' ? 'bg-blue-100 text-blue-800' : 
                        studentData.gender === 'Nữ' ? 'bg-pink-100 text-pink-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {studentData.gender || "Chưa xác định"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Ngày sinh:</span>
                    <span className="text-gray-900 dark:text-white">
                      {studentData.dateOfBirth 
                        ? formatDateTime(studentData.dateOfBirth)
                        : "Chưa cập nhật"
                      }
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Email:</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {studentData.email || "Chưa có email"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Số điện thoại:</span>
                    <span className="text-gray-900 dark:text-white font-mono">
                      {studentData.phoneNumber || "Chưa có SĐT"}
                    </span>
                  </div>
                  <div className="flex flex-col p-2 bg-white dark:bg-gray-700 rounded border">
                    <span className="font-medium text-gray-600 dark:text-gray-400 mb-1">Địa chỉ:</span>
                    <span className="text-gray-900 dark:text-white break-words">
                      {studentData.address || "Chưa cập nhật địa chỉ"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Lớp học:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${studentData.classId ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {studentData.classId ? (
                        classes.find(cls => cls.id === studentData.classId)?.code || `Lớp ${studentData.classId}`
                      ) : (
                        "Chưa phân lớp"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Ngày tạo:</span>
                    <span className="text-gray-900 dark:text-white text-xs">
                      {formatDateTime(studentData.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-white dark:bg-gray-700 rounded border">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Cập nhật lần cuối:</span>
                    <span className="text-gray-900 dark:text-white text-xs">
                      {formatDateTime(studentData.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Summary Badge */}
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Trạng thái: {studentData.email && studentData.phoneNumber ? 'Đầy đủ thông tin' : 'Thiếu thông tin'}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${studentData.email && studentData.phoneNumber 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'}`}>
                    {studentData.email && studentData.phoneNumber ? '✓ Hoàn tất' : '⚠ Cần cập nhật'}
                  </span>
                </div>
              </div>
            </div>
          )}
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