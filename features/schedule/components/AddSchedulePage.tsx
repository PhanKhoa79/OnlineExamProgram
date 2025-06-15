"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/hooks/use-toast";
import { NavigableBreadcrumb } from "@/components/ui/NavigableBreadcrumb";
import { createSchedule } from "@/features/schedule/services/scheduleServices";
import { getAllSubjects } from "@/features/subject/services/subjectServices";
import { CreateExamScheduleDto } from "@/features/schedule/types/schedule";
import { SubjectResponseDto } from "@/features/subject/types/subject";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const AddSchedulePage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [subjects, setSubjects] = useState<SubjectResponseDto[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateExamScheduleDto>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subjectsData = await getAllSubjects();
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Lỗi khi tải dữ liệu",
          variant: "error",
        });
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: CreateExamScheduleDto, exitAfterSave = false) => {
    try {
      setIsLoading(true);

      // Client-side validation
      if (new Date(data.endTime) <= new Date(data.startTime)) {
        toast({
          title: "Lỗi thời gian",
          description: "Thời gian kết thúc phải sau thời gian bắt đầu.",
          variant: "error",
        });
        return;
      }

      const scheduleData: CreateExamScheduleDto = {
        code: data.code,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status || 'active',
        description: data.description,
        subjectId: data.subjectId,
      };

      const response = await createSchedule(scheduleData);

      toast({
        title: "Tạo lịch thi thành công!",
        description: `Lịch thi "${data.code}" đã được tạo.`,
      });

      if (exitAfterSave) {
        router.push("/dashboard/schedule");
      } else {
        router.push(`/dashboard/schedule/edit/${response.id}`);
      }

      reset();
    } catch (error: any) {
      console.error("Error creating schedule:", error);
      
      let errorMessage = "Có lỗi xảy ra khi tạo lịch thi. Vui lòng thử lại.";
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Lỗi khi tạo lịch thi",
        description: errorMessage,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (exitAfterSave = false) => {
    handleSubmit((data) => onSubmit(data, exitAfterSave))();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <NavigableBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard", isHome: true },
          { label: "Lịch thi", href: "/dashboard/schedule" },
          { label: "Thêm lịch thi", isActive: true },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Thêm lịch thi mới</h2>
          <p className="text-muted-foreground">
            Tạo lịch thi mới cho hệ thống
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/schedule")}
          >
            Hủy
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave(true)}
            disabled={isLoading}
          >
            Lưu và thoát
          </Button>
          <Button
            onClick={() => handleSave(false)}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Đang lưu..." : "Lưu và chỉnh sửa"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin lịch thi</CardTitle>
              <CardDescription>
                Nhập thông tin cơ bản cho lịch thi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="code">
                    Mã lịch thi <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="code"
                    placeholder="Nhập mã lịch thi"
                    {...register("code", {
                      required: "Mã lịch thi là bắt buộc",
                    })}
                  />
                  {errors.code && (
                    <p className="text-sm text-red-500">{errors.code.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subjectId">
                    Môn học <span className="text-red-500">*</span>
                  </Label>
                  <input 
                    type="hidden" 
                    {...register("subjectId", { 
                      required: "Môn học là bắt buộc",
                      valueAsNumber: true 
                    })} 
                  />
                  <Select
                    onValueChange={(value) => setValue("subjectId", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn môn học" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name} ({subject.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.subjectId && (
                    <p className="text-sm text-red-500">{errors.subjectId.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startTime">
                    Thời gian bắt đầu <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    {...register("startTime", {
                      required: "Thời gian bắt đầu là bắt buộc",
                      validate: {
                        validDate: (value) => {
                          const startTime = new Date(value);
                          const now = new Date();
                          if (startTime < now) {
                            return "Thời gian bắt đầu không thể ở quá khứ";
                          }
                          return true;
                        }
                      }
                    })}
                  />
                  {errors.startTime && (
                    <p className="text-sm text-red-500">{errors.startTime.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">
                    Thời gian kết thúc <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    {...register("endTime", {
                      required: "Thời gian kết thúc là bắt buộc",
                      validate: {
                        validEndTime: (value) => {
                          const startTime = watch("startTime");
                          if (startTime && new Date(value) <= new Date(startTime)) {
                            return "Thời gian kết thúc phải sau thời gian bắt đầu";
                          }
                          return true;
                        }
                      }
                    })}
                  />
                  {errors.endTime && (
                    <p className="text-sm text-red-500">{errors.endTime.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  onValueChange={(value) => setValue("status", value as 'active' | 'completed' | 'cancelled')}
                  defaultValue="active"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  placeholder="Nhập mô tả cho lịch thi (tùy chọn)"
                  rows={4}
                  {...register("description")}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt</CardTitle>
              <CardDescription>
                Thông tin tổng quan về lịch thi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mã lịch thi:</span>
                  <span className="font-medium">
                    {watch("code") || "Chưa nhập"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Môn học:</span>
                  <span className="font-medium">
                    {watch("subjectId") 
                      ? subjects.find(s => s.id === parseInt(watch("subjectId").toString()))?.name || "Không xác định"
                      : "Chưa chọn"
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <span className="font-medium">
                    {watch("status") === 'active' && "Hoạt động"}
                    {watch("status") === 'completed' && "Hoàn thành"}
                    {watch("status") === 'cancelled' && "Đã hủy"}
                    {!watch("status") && "Hoạt động"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Thời gian bắt đầu:</span>
                  <span className="font-medium">
                    {watch("startTime") 
                      ? new Date(watch("startTime")).toLocaleString('vi-VN')
                      : "Chưa nhập"
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Thời gian kết thúc:</span>
                  <span className="font-medium">
                    {watch("endTime") 
                      ? new Date(watch("endTime")).toLocaleString('vi-VN')
                      : "Chưa nhập"
                    }
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hướng dẫn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Mã lịch thi phải là duy nhất trong hệ thống</p>
              <p>• Thời gian kết thúc phải sau thời gian bắt đầu</p>
              <p>• Trạng thái mặc định là &quot;Hoạt động&quot;</p>
              <p>• Bạn có thể thêm mô tả để ghi chú thêm thông tin</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddSchedulePage; 