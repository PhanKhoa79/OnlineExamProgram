"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "@/components/hooks/use-toast";
import AuthInput from "@/components/ui/AuthInput";
import { Edit, SaveOutlined, Description, Info } from "@mui/icons-material";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
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
import { getSubjectById, updateSubject } from "@/features/subject/services/subjectServices";
import { updateSubject as updateSubjectAction } from "@/store/subjectSlice";
import { getSubjectErrorMessage } from "../utils/validation";
import { SubjectResponseDto } from "@/features/subject/types/subject";
import { formatDateTime } from "@/lib/dateUtils";

export default function EditSubjectPage({ id }: { id: number }) {
  const dispatch = useDispatch();

  const [subjectName, setSubjectName] = useState<string>("");
  const [subjectCode, setSubjectCode] = useState<string>("");
  const [subjectDescription, setSubjectDescription] = useState<string>("");
  const [subjectNameError, setSubjectNameError] = useState<string>("");
  const [subjectCodeError, setSubjectCodeError] = useState<string>("");
  const [subjectDescriptionError, setSubjectDescriptionError] = useState<string>("");
  const [currentSubjectData, setCurrentSubjectData] = useState<SubjectResponseDto | null>(null);

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

  useEffect(() => {
    (async () => {
      try {
        const res = await getSubjectById(id);
        if (res) {
          setCurrentSubjectData(res);
          setSubjectName(res.name);
          setSubjectCode(res.code);
          setSubjectDescription(res.description || "");
        } else {
          console.error("Error fetching subject data:");
          toast({
            title: "Lỗi khi lấy thông tin môn học",
            variant: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching subject data:", error);
        toast({
          title: "Lỗi khi lấy thông tin môn học",
          variant: "error",
        });
      }
    })();
  }, [id]);

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
      const response = await updateSubject(id, {
        name: subjectName,
        code: subjectCode,
        description: subjectDescription.trim() || undefined,
      });

      const updatedSubjectData = await getSubjectById(id);
      setCurrentSubjectData(updatedSubjectData);

      dispatch(updateSubjectAction(response));
      toast({ title: "Cập nhật môn học thành công" });
      if (exitAfterSave) {
        window.location.href = "/dashboard/subject";
      }
    } catch (error: unknown) {
      toast({
        title: "Lỗi khi cập nhật môn học",
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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/dashboard"
              isHome={true}
            >
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/subject">
              Môn học
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Chỉnh sửa môn học</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center space-y-3 py-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full shadow-lg">
          <Edit className="h-6 w-6" />
          <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa môn học</h1>
        </div>
        <p className="text-lg text-gray-600 font-medium">
          Chỉnh sửa môn học: <span className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">&quot;{subjectName}&quot;</span>
        </p>
      </div>
      {/* Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Thông tin môn học</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <AuthInput
            id="subjectCode"
            title="Mã môn học"
            type="text"
            label="Mã môn học"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
            Icon={Edit}
            error={subjectCodeError}
          />
          <AuthInput
            id="subjectName"
            title="Tên môn học"
            type="text"
            label="Tên môn học"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            Icon={Edit}
            error={subjectNameError}
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

      {/* Thông tin chi tiết môn học */}
      {currentSubjectData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Thông tin chi tiết môn học
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="space-y-1">
                <Label className="font-semibold text-gray-600">ID môn học:</Label>
                <p className="text-gray-800">{currentSubjectData.id}</p>
              </div>
              <div className="space-y-1">
                <Label className="font-semibold text-gray-600">Mã môn học:</Label>
                <p className="text-gray-800">{currentSubjectData.code}</p>
              </div>
              <div className="space-y-1">
                <Label className="font-semibold text-gray-600">Tên môn học:</Label>
                <p className="text-gray-800">{currentSubjectData.name}</p>
              </div>
              <div className="space-y-1">
                <Label className="font-semibold text-gray-600">Mô tả:</Label>
                <p className="text-gray-800">{currentSubjectData.description || "Không có mô tả"}</p>
              </div>
              {currentSubjectData.createdAt && (
                <div className="space-y-1">
                  <Label className="font-semibold text-gray-600">Ngày tạo:</Label>
                  <p className="text-gray-800">{formatDateTime(currentSubjectData.createdAt)}</p>
                </div>
              )}
              {currentSubjectData.updatedAt && (
                <div className="space-y-1">
                  <Label className="font-semibold text-gray-600">Cập nhật lần cuối:</Label>
                  <p className="text-gray-800">{formatDateTime(currentSubjectData.updatedAt)}</p>
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