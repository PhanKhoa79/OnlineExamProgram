"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "@/components/hooks/use-toast";
import AuthInput from "@/components/ui/AuthInput";
import { Edit, SaveOutlined, Info } from "@mui/icons-material";
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
import { Label } from "@/components/ui/label";
import { getClassById, updateClass } from "@/features/classes/services/classServices";
import { updateClass as updateClassAction } from "@/store/classSlice";
import { getErrorMessage, schema } from "@/lib/validationAuth";
import { ClassResponseDto } from "@/features/classes/types/class.type";
import { formatDateTime } from "@/lib/dateUtils";

export default function EditClassPage({ id }: { id: number }) {
  const dispatch = useDispatch();

  const [className, setClassName] = useState<string>("");
  const [codeClass, setCodeClass] = useState<string>("");
  const [classNameError, setClassNameError] = useState<string>("");
  const [codeClassError, setCodeClassError] = useState<string>("");
  const [currentClassData, setCurrentClassData] = useState<ClassResponseDto | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { classNameError, codeClassError } = getErrorMessage(schema, { className, codeClass });
    setClassNameError(classNameError);
    setCodeClassError(codeClassError);
  }, [className, codeClass]);

  useEffect(() => {
    (async () => {
      const res = await getClassById(id);
      if (res) {
        setCurrentClassData(res);
        setClassName(res.name);
        setCodeClass(res.code);
      } else {
        toast({
          title: "Lỗi khi lấy thông tin lớp học",
          variant: "error",
        });
      }
    })();
  }, [id]);

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
      const response = await updateClass(id, {
        name: className,
        code: codeClass,
      });

      // Cập nhật currentClassData ngay lập tức
      setCurrentClassData(response);

      dispatch(updateClassAction(response));
      toast({ title: "Cập nhật lớp học thành công" });
      if (exitAfterSave) {
        window.location.href = "/dashboard/class";
      }
    } catch (error: unknown) {
      toast({
        title: "Lỗi khi cập nhật lớp học",
        description: error instanceof Error ? error.message : "Đã có lỗi xảy ra",
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
            href="/dashboard/class"
            className="text-blue-600 underline font-semibold"
          >
            Lớp học
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>Chỉnh sửa lớp học</BreadcrumbItem>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa lớp học</h1>
        <p className="text-muted-foreground">
          Chỉnh sửa lớp học: &quot;{className}&quot;
        </p>
      </div>
      {/* Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Thông tin lớp học</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <AuthInput
            id="className"
            title="Tên lớp học"
            type="text"
            label="Tên lớp học"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            Icon={Edit}
            error={classNameError}
          />
          <AuthInput
            id="codeClass"
            title="Mã lớp học"
            type="text"
            label="Mã lớp học"
            value={codeClass}
            onChange={(e) => setCodeClass(e.target.value)}
            Icon={Edit}
            error={codeClassError}
          />
        </CardContent>
      </Card>

      {/* Thông tin chi tiết lớp học */}
      {currentClassData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Thông tin chi tiết lớp học
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <Label className="font-semibold text-gray-600">ID lớp học:</Label>
                <p className="text-gray-800">{currentClassData.id}</p>
              </div>
              <div className="space-y-1">
                <Label className="font-semibold text-gray-600">Tên lớp học:</Label>
                <p className="text-gray-800">{currentClassData.name}</p>
              </div>
              <div className="space-y-1">
                <Label className="font-semibold text-gray-600">Mã lớp học:</Label>
                <p className="text-gray-800">{currentClassData.code}</p>
              </div>
              {currentClassData.createdAt && (
                <div className="space-y-1">
                  <Label className="font-semibold text-gray-600">Ngày tạo:</Label>
                  <p className="text-gray-800">{formatDateTime(currentClassData.createdAt)}</p>
                </div>
              )}
              {currentClassData.updatedAt && (
                <div className="space-y-1">
                  <Label className="font-semibold text-gray-600">Cập nhật lần cuối:</Label>
                  <p className="text-gray-800">{formatDateTime(currentClassData.updatedAt)}</p>
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
