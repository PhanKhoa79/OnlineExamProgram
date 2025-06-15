"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "@/components/hooks/use-toast";
import { schema, getErrorMessage } from "@/lib/validationAuth";
import AuthInput from "@/components/ui/AuthInput";
import { SaveOutlined, Create } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { NavigableBreadcrumb } from "@/components/ui/NavigableBreadcrumb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClass } from "../services/classServices";
import { addClass } from "@/store/classSlice";

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

export default function AddClassPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [className, setClassName] = useState<string>("");
  const [codeClass, setCodeClass] = useState<string>("");
  const [classNameError, setClassNameError] = useState<string>("");
  const [codeClassError, setCodeClassError] = useState<string>("");

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const { classNameError, codeClassError } = getErrorMessage(schema, { className, codeClass });
    setClassNameError(classNameError);
    setCodeClassError(codeClassError);
  }, [className, codeClass]);

  const handleSubmit = async (exitAfterSave = false) => {
    setLoading(true);

    const { classNameError, codeClassError } = getErrorMessage(schema, { className, codeClass });
    setClassNameError(classNameError);
    setCodeClassError(codeClassError);
    if (classNameError || codeClassError) {
      setLoading(false);
      return;
    }

    try {
        const response = await createClass({
            name: className.trim(),
            code: codeClass.trim(),
        });

        dispatch(addClass(response));
        toast({ title: "Tạo lớp thành công" });
        if (exitAfterSave) {
            router.push("/dashboard/class");
        } else {
            router.push(`/dashboard/class/edit/${response.id}`);
        } 
        setClassName("");
        setCodeClass("");
    } catch (error: unknown) {
        console.error("Error creating class:", error);
        
        let errorMessage = "Đã có lỗi xảy ra";
        
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
          title: "Lỗi khi tạo lớp học",
          description: errorMessage,
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
          { label: "Lớp học", href: "/dashboard/class" },
          { label: "Thêm lớp học", isActive: true },
        ]}
      />

      <div className="text-center space-y-3 py-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg">
          <Create className="h-6 w-6" />
          <h1 className="text-2xl font-bold tracking-tight">Thêm lớp học mới</h1>
        </div>
        <p className="text-lg text-gray-600 font-medium">
          Tạo lớp học mới với <span className="text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full">các thông tin cần thiết</span>
        </p>
      </div>
      {/* Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Tạo lớp học</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <AuthInput
            id="className"
            title="Tên lớp học"
            type="text"
            label="Tên lớp học"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            error={classNameError}
            Icon={Create}
          />
          <AuthInput
            id="codeClass"
            title="Mã lớp học"
            type="text"
            label="Mã lớp học"
            value={codeClass}
            onChange={(e) => setCodeClass(e.target.value)}
            error={codeClassError}
            Icon={Create}
          />
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
