"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "@/components/hooks/use-toast";
import { getSubjectErrorMessage } from "../utils/validation";
import AuthInput from "@/components/ui/AuthInput";
import { SaveOutlined, Create, Description } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSubject } from "../services/subjectServices";
import { addSubject } from "@/store/subjectSlice";

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

export default function AddSubjectPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [subjectName, setSubjectName] = useState<string>("");
  const [subjectCode, setSubjectCode] = useState<string>("");
  const [subjectDescription, setSubjectDescription] = useState<string>("");
  const [subjectNameError, setSubjectNameError] = useState<string>("");
  const [subjectCodeError, setSubjectCodeError] = useState<string>("");
  const [subjectDescriptionError, setSubjectDescriptionError] = useState<string>("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { subjectNameError, subjectCodeError, subjectDescriptionError } = getSubjectErrorMessage({
      subjectName,
      subjectCode,
      subjectDescription,
    });
    setSubjectNameError(subjectNameError || "");
    setSubjectCodeError(subjectCodeError || "");
    setSubjectDescriptionError(subjectDescriptionError || "");
  }, [subjectName, subjectCode, subjectDescription]);

  const handleSubmit = async (exitAfterSave = false) => {
    setLoading(true);

    const { subjectNameError, subjectCodeError, subjectDescriptionError } = getSubjectErrorMessage({
      subjectName,
      subjectCode,
      subjectDescription,
    });
    setSubjectNameError(subjectNameError || "");
    setSubjectCodeError(subjectCodeError || "");
    setSubjectDescriptionError(subjectDescriptionError || "");

    if (subjectNameError || subjectCodeError) {
      setLoading(false);
      return;
    }

    try {
      const response = await createSubject({
        name: subjectName.trim(),
        code: subjectCode.trim(),
        description: subjectDescription.trim() || undefined,
      });

      dispatch(addSubject(response));
      toast({ title: "Tạo môn học thành công" });
      if (exitAfterSave) {
        router.push("/dashboard/subject");
      } else {
        router.push(`/dashboard/subject/edit/${response.id}`);
      }
      setSubjectName("");
      setSubjectCode("");
      setSubjectDescription("");
    } catch (error: unknown) {
      console.error("Error creating subject:", error);
      
      let errorMessage = "Đã có lỗi xảy ra";
      
      // Type assertion for error handling
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
        title: "Lỗi khi tạo môn học",
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
      <Breadcrumb className="flex list-none items-center gap-2">
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/dashboard"
            className="text-blue-600 underline font-semibold"
          >
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/dashboard/subject"
            className="text-blue-600 underline font-semibold"
          >
            Môn học
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>Thêm môn học</BreadcrumbItem>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Thêm môn học mới</h1>
        <p className="text-muted-foreground">
          Tạo môn học mới với các thông tin cần thiết
        </p>
      </div>

      {/* Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Tạo môn học</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <AuthInput
            id="subjectCode"
            title="Mã môn học"
            type="text"
            label="Mã môn học"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
            error={subjectCodeError}
            Icon={Create}
          />
          <AuthInput
            id="subjectName"
            title="Tên môn học"
            type="text"
            label="Tên môn học"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            error={subjectNameError}
            Icon={Create}
          />
          
          {/* Description textarea */}
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-white">
              <Description className="inline mr-2" sx={{ fontSize: 18 }} />
              Mô tả môn học
            </label>
            <textarea
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none ${
                subjectDescriptionError 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              rows={4}
              value={subjectDescription}
              onChange={(e) => setSubjectDescription(e.target.value)}
              placeholder="Nhập mô tả cho môn học (tùy chọn)"
            />
            {subjectDescriptionError && (
              <span className="text-red-500 text-sm">{subjectDescriptionError}</span>
            )}
          </div>
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