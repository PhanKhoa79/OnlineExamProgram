"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/hooks/use-toast";
import { NavigableBreadcrumb } from "@/components/ui/NavigableBreadcrumb";
import { getRoomById, updateRoom } from "@/features/room/services/roomServices";
import { getAllExams } from "@/features/exam/services/examServices";
import { getSchedulesByStatus } from "@/features/schedule/services/scheduleServices";
import { getAllClasses } from "@/features/classes/services/classServices";
import { UpdateRoomDto, RoomDto } from "@/features/room/types/room";
import { ExamDto } from "@/features/exam/types/exam.type";
import { ExamScheduleDto } from "@/features/schedule/types/schedule";
import { ClassResponseDto } from "@/features/classes/types/class.type";
import { ROOM_FORM_VALIDATION } from "../data/roomConstants";
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
import { MeetingRoom, Save, ArrowLeft } from "@mui/icons-material";

const EditRoomPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const roomId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [room, setRoom] = useState<RoomDto | null>(null);
  const [exams, setExams] = useState<ExamDto[]>([]);
  const [schedules, setSchedules] = useState<ExamScheduleDto[]>([]);
  const [classes, setClasses] = useState<ClassResponseDto[]>([]);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<number | 'all'>('all');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<UpdateRoomDto>();

  // Get unique subjects from exams
  const availableSubjects = React.useMemo(() => {
    const subjects = exams.map(exam => exam.subject).filter(Boolean);
    const uniqueSubjects = subjects.filter((subject, index, self) => 
      index === self.findIndex(s => s.id === subject.id)
    );
    return uniqueSubjects;
  }, [exams]);

  // Filter exams by selected subject
  const filteredExams = React.useMemo(() => {
    if (selectedSubjectFilter === 'all') {
      return exams;
    }
    return exams.filter(exam => exam.subject?.id === selectedSubjectFilter);
  }, [exams, selectedSubjectFilter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsDataLoading(true);
        const [roomData, examsData, schedulesData, classesData] = await Promise.all([
          getRoomById(parseInt(roomId)),
          getAllExams(),
          getSchedulesByStatus('active'),
          getAllClasses(),
        ]);
        
        setRoom(roomData);
        setExams(examsData);
        setSchedules(schedulesData);
        setClasses(classesData);

        // Form will be reset in separate useEffect when all data is ready
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Lỗi khi tải dữ liệu",
          description: "Không thể tải thông tin phòng thi.",
          variant: "error",
        });
        router.push("/dashboard/room");
      } finally {
        setIsDataLoading(false);
      }
    };

    if (roomId) {
      fetchData();
    }
  }, [roomId, reset, router]);

  // Reset form when all data is loaded
  useEffect(() => {
    if (room && exams.length > 0 && schedules.length > 0 && classes.length > 0) {
      
      const formData = {
        code: room.code,
        randomizeOrder: room.randomizeOrder,
        status: room.status,
        description: room.description || '',
        examId: room.exam?.id || room.examId,
        examScheduleId: room.examSchedule?.id || room.examScheduleId,
        classId: room.class?.id || room.classId,
        maxParticipants: room.maxParticipants,
      };
      
      reset(formData);

      // Set subject filter based on selected exam
      if (room.exam?.subject?.id) {
        setSelectedSubjectFilter(room.exam.subject.id);
      }
    }
  }, [room, exams, schedules, classes, reset]);

  const onSubmit = async (data: UpdateRoomDto, exitAfterSave = false) => {
    try {
      setIsLoading(true);

      const roomData: UpdateRoomDto = {
        code: data.code,
        randomizeOrder: data.randomizeOrder,
        status: data.status,
        description: data.description,
        examId: data.examId,
        classId: data.classId,
        maxParticipants: data.maxParticipants,
      };

      const response = await updateRoom(parseInt(roomId), roomData);

      toast({
        title: "Cập nhật phòng thi thành công!",
        description: `Phòng thi "${response.code}" đã được cập nhật.`,
      });

      if (exitAfterSave) {
        router.push("/dashboard/room");
      }
    } catch (error: unknown) {
      console.error("Error updating room:", error);
      
      let errorMessage = "Vui lòng kiểm tra lại thông tin và thử lại.";
      
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
        title: "Lỗi khi cập nhật phòng thi",
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

  const handleCancel = () => {
    router.push("/dashboard/room");
  };

  if (isDataLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không tìm thấy phòng thi.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <NavigableBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard", isHome: true },
          { label: "Phòng thi", href: "/dashboard/room" },
          { label: `Chỉnh sửa phòng thi ${room.code}`, isActive: true },
        ]}
      />

      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="p-2 bg-white/20 rounded-full">
            <MeetingRoom className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Chỉnh sửa phòng thi</h1>
        </div>
        <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
          Cập nhật thông tin phòng thi &quot;{room.code}&quot;
        </p>
      </div>

      <Card className="max-w-5xl mx-auto shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-100 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MeetingRoom className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl text-gray-800">Thông tin phòng thi</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                Chỉnh sửa thông tin chi tiết của phòng thi
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          <form onSubmit={handleSubmit((data) => onSubmit(data, true))} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="code">
                  Mã phòng thi <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="code"
                  {...register("code", ROOM_FORM_VALIDATION.code)}
                  placeholder="Nhập mã phòng thi"
                  className={errors.code ? "border-red-500" : ""}
                />
                {errors.code && (
                  <p className="text-sm text-red-500">{errors.code.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(value: 'waiting' | 'open' | 'closed') => setValue("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="waiting">Chờ mở</SelectItem>
                    <SelectItem value="open">Đang mở</SelectItem>
                    <SelectItem value="closed">Đã đóng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Exam, Schedule, Class Selection */}
            <div className="space-y-4">
              {/* Subject Filter */}
              <div className="flex items-center gap-2">
                <Label htmlFor="subjectFilter" className="text-sm whitespace-nowrap">Lọc đề thi theo môn:</Label>
                <Select
                  value={selectedSubjectFilter.toString()}
                  onValueChange={(value) => setSelectedSubjectFilter(value === 'all' ? 'all' : parseInt(value))}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Chọn môn học" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả môn học</SelectItem>
                    {availableSubjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-500">
                  {filteredExams.length}/{exams.length} đề thi
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="examId">
                    Bài thi <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch("examId")?.toString()}
                    onValueChange={(value) => setValue("examId", parseInt(value))}
                  >
                    <SelectTrigger className={errors.examId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Chọn bài thi" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredExams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id.toString()}>
                          {exam.name} ({exam.examType === 'practice' ? 'Luyện tập' : 'Chính thức'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.examId && (
                    <p className="text-sm text-red-500">Vui lòng chọn bài thi</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Lịch thi hiện tại</Label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    <p className="text-sm font-medium">
                      {room?.examSchedule?.code || 'Chưa có lịch thi'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Không thể thay đổi lịch thi khi chỉnh sửa phòng
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classId">
                    Lớp học <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={watch("classId")?.toString()}
                    onValueChange={(value) => setValue("classId", parseInt(value))}
                  >
                    <SelectTrigger className={errors.classId ? "border-red-500" : ""}>
                      <SelectValue placeholder="Chọn lớp học" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id.toString()}>
                          {cls.name} ({cls.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.classId && (
                    <p className="text-sm text-red-500">Vui lòng chọn lớp học</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Số người tham gia tối đa</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  {...register("maxParticipants", {
                    ...ROOM_FORM_VALIDATION.maxParticipants,
                    valueAsNumber: true,
                  })}
                  placeholder="Nhập số người tối đa"
                  className={errors.maxParticipants ? "border-red-500" : ""}
                />
                {errors.maxParticipants && (
                  <p className="text-sm text-red-500">{errors.maxParticipants.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Cài đặt</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="randomizeOrder"
                    checked={watch("randomizeOrder")}
                    onCheckedChange={(checked) => setValue("randomizeOrder", !!checked)}
                  />
                  <Label htmlFor="randomizeOrder" className="text-sm font-normal">
                    Trộn thứ tự câu hỏi
                  </Label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                {...register("description", ROOM_FORM_VALIDATION.description)}
                placeholder="Nhập mô tả cho phòng thi (tùy chọn)"
                rows={3}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex items-center gap-2 h-12 px-6 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Hủy
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSave(false)}
                  disabled={isLoading}
                  className="flex items-center gap-2 h-12 px-6 border-blue-300 text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
                >
                  <Save className="h-5 w-5" />
                  {isLoading ? "Đang lưu..." : "Lưu"}
                </Button>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Save className="h-5 w-5" />
                  {isLoading ? "Đang lưu..." : "Lưu và thoát"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditRoomPage; 