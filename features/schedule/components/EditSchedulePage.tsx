"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/hooks/use-toast";
import { NavigableBreadcrumb } from "@/components/ui/NavigableBreadcrumb";
import { getScheduleById, updateSchedule } from "@/features/schedule/services/scheduleServices";
import { getAllSubjects } from "@/features/subject/services/subjectServices";
import { getAllClasses } from "@/features/classes/services/classServices";
import { UpdateExamScheduleDto, ExamScheduleDto } from "@/features/schedule/types/schedule";
import { SubjectResponseDto } from "@/features/subject/types/subject";
import { ClassResponseDto } from "@/features/classes/types/class.type";
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
import { Calendar, Clock, BookOpen, Hash, FileText, Info, Users } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditScheduleFormData {
  code: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'completed' | 'cancelled';
  description?: string;
  subjectId: number;
}

const EditSchedulePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const scheduleId = parseInt(params?.id as string);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [subjects, setSubjects] = useState<SubjectResponseDto[]>([]);
  const [classes, setClasses] = useState<ClassResponseDto[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [scheduleData, setScheduleData] = useState<ExamScheduleDto | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EditScheduleFormData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoading(true);
        const [scheduleResult, subjectsData, classesData] = await Promise.all([
          getScheduleById(scheduleId),
          getAllSubjects(),
          getAllClasses(),
        ]);

        setScheduleData(scheduleResult);
        setSubjects(subjectsData);
        setClasses(classesData);

        // Set selected classes from schedule data
        if (scheduleResult.classes && scheduleResult.classes.length > 0) {
          const classIds = scheduleResult.classes.map(cls => cls.id);
          setSelectedClasses(classIds);
        }

        const startTime = new Date(scheduleResult.startTime);
        const endTime = new Date(scheduleResult.endTime);
        
        // Chuyển đổi thời gian về múi giờ địa phương để hiển thị đúng
        const formatDateTimeLocal = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        };
        
        const subjectId = scheduleResult.subject?.id || scheduleResult.subjectId;
        const formData = {
          code: scheduleResult.code,
          startTime: formatDateTimeLocal(startTime),
          endTime: formatDateTimeLocal(endTime),
          status: scheduleResult.status,
          description: scheduleResult.description || '',
          subjectId: Number(subjectId),
        };
        reset(formData);

        setTimeout(() => {
          setValue("subjectId", Number(subjectId));
          console.log("SubjectId set to:", Number(subjectId));
          console.log("Current watch value:", watch("subjectId"));
        }, 100);

      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Lỗi khi tải dữ liệu",
          variant: "error",
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    if (scheduleId) {
      fetchData();
    }
  }, [scheduleId, reset, setValue, watch]);

  const toggleClass = (classId: number) => {
    setSelectedClasses(prev => {
      if (prev.includes(classId)) {
        return prev.filter(id => id !== classId);
      } else {
        return [...prev, classId];
      }
    });
  };

  const onSubmit = async (data: EditScheduleFormData, exitAfterSave = false) => {
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

      if (!scheduleData) {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy dữ liệu lịch thi gốc.",
          variant: "error",
        });
        return;
      }

      // Chỉ gửi những field thực sự thay đổi
      const updateData: UpdateExamScheduleDto = {};

      // So sánh và chỉ thêm field nào thay đổi
      if (data.code !== scheduleData.code) {
        updateData.code = data.code;
      }

      // Chuyển đổi thời gian để so sánh (sử dụng formatDateTimeLocal để đồng nhất)
      const formatDateTimeLocal = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      const originalStartTime = formatDateTimeLocal(new Date(scheduleData.startTime));
      const originalEndTime = formatDateTimeLocal(new Date(scheduleData.endTime));
      
      if (data.startTime !== originalStartTime) {
        updateData.startTime = new Date(data.startTime).toISOString();
      }

      if (data.endTime !== originalEndTime) {
        updateData.endTime = new Date(data.endTime).toISOString();
      }

      if (data.status !== scheduleData.status) {
        updateData.status = data.status;
      }

      if (data.description !== (scheduleData.description || '')) {
        updateData.description = data.description;
      }

      const originalSubjectId = scheduleData.subject?.id || scheduleData.subjectId;
      if (data.subjectId !== originalSubjectId) {
        updateData.subjectId = data.subjectId;
      }

      // Check if class selection has changed
      const originalClassIds = scheduleData.classes?.map(cls => cls.id) || [];
      const classIdsChanged = 
        selectedClasses.length !== originalClassIds.length || 
        selectedClasses.some(id => !originalClassIds.includes(id));
      
      if (classIdsChanged) {
        updateData.classIds = selectedClasses;
      }

      // Kiểm tra xem có thay đổi gì không
      if (Object.keys(updateData).length === 0) {
        toast({
          title: "Thông báo",
          description: "Không có thay đổi nào để lưu.",
        });
        return;
      }

      await updateSchedule(scheduleId, updateData);

      const updatedScheduleData = await getScheduleById(scheduleId);
      setScheduleData(updatedScheduleData);

      toast({
        title: "Cập nhật lịch thi thành công!",
        description: `Lịch thi "${data.code}" đã được cập nhật.`,
      });

      if (exitAfterSave) {
        router.push("/dashboard/schedule");
      }
    } catch (error: unknown) {
      console.error("Error updating schedule:", error);
      
      let errorMessage = "Có lỗi xảy ra khi cập nhật lịch thi. Vui lòng thử lại.";
      
      if (error && typeof error === 'object') {
        const errorObj = error as {
          response?: {
            data?: {
              message?: string;
              error?: string;
            };
          };
          message?: string;
        };
        if (errorObj?.response?.data?.message) {
          errorMessage = errorObj.response.data.message;
        } else if (errorObj?.response?.data?.error) {
          errorMessage = errorObj.response.data.error;
        } else if (errorObj?.message) {
          errorMessage = errorObj.message;
        }
      }

      toast({
        title: "Lỗi khi cập nhật lịch thi",
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

  if (isDataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!scheduleData) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Không tìm thấy lịch thi</h2>
          <p className="text-gray-600 mt-2">Lịch thi bạn đang tìm kiếm không tồn tại.</p>
        </div>
      </div>
    );
  }

  
  const fallbackSubjectId = scheduleData?.subject?.id || scheduleData?.subjectId;
  const currentSubjectId = watch("subjectId") || fallbackSubjectId;
  const selectedSubject = subjects.find(s => s.id === currentSubjectId);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <NavigableBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard", isHome: true },
          { label: "Lịch thi", href: "/dashboard/schedule" },
          { label: "Sửa lịch thi", isActive: true },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Chỉnh sửa lịch thi</h2>
          <p className="text-muted-foreground">
            Cập nhật thông tin lịch thi &quot;{scheduleData.code}&quot;
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
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
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
                Cập nhật thông tin cơ bản cho lịch thi
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
                    value={watch("subjectId")?.toString() || ""}
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
                  value={watch("status")}
                  onValueChange={(value) => setValue("status", value as 'active' | 'completed' | 'cancelled')}
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

          {/* Class Selection Card */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-3">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Danh sách lớp học</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {classes.length > 0 ? (
                <ScrollArea className="h-[200px] rounded-md border p-4">
                  <div className="space-y-4">
                    {classes.map((classItem) => (
                      <div key={classItem.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`class-${classItem.id}`} 
                          checked={selectedClasses.includes(classItem.id)}
                          onCheckedChange={() => toggleClass(classItem.id)}
                        />
                        <label
                          htmlFor={`class-${classItem.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {classItem.name} ({classItem.code})
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground">Không có lớp học nào.</p>
              )}
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Đã chọn {selectedClasses.length} lớp học
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Details Section */}
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-3">
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Thông tin chi tiết lịch thi</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">ID</p>
                    <p className="text-sm text-gray-900">{scheduleData.id}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mã lịch thi</p>
                    <p className="text-sm text-gray-900">{scheduleData.code}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Môn học</p>
                    <p className="text-sm text-gray-900">
                      {selectedSubject ? `${selectedSubject.name} (${selectedSubject.code})` : 'Không xác định'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="h-4 w-4 rounded-full bg-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Trạng thái</p>
                    <p className="text-sm text-gray-900">
                      {scheduleData.status === 'active' && 'Hoạt động'}
                      {scheduleData.status === 'completed' && 'Hoàn thành'}
                      {scheduleData.status === 'cancelled' && 'Đã hủy'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ngày tạo</p>
                    <p className="text-sm text-gray-900">
                      {new Date(scheduleData.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Cập nhật lần cuối</p>
                    <p className="text-sm text-gray-900">
                      {new Date(scheduleData.updatedAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
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
                      ? subjects.find(s => s.id === watch("subjectId"))?.name || "Không xác định"
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
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Số lớp học:</span>
                  <span className="font-medium">
                    {selectedClasses.length} lớp
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
              <p>• Hãy cẩn thận khi thay đổi trạng thái lịch thi</p>
              <p>• Mô tả có thể để trống hoặc ghi chú thêm thông tin</p>
              <p>• Thay đổi danh sách lớp học sẽ ảnh hưởng đến việc tham gia lịch thi</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EditSchedulePage; 