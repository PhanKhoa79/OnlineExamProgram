"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/hooks/use-toast";
import { NavigableBreadcrumb } from "@/components/ui/NavigableBreadcrumb";
import { createRoom } from "@/features/room/services/roomServices";
import { getAllExams } from "@/features/exam/services/examServices";
import { getSchedulesByStatus, getClassesByScheduleId } from "@/features/schedule/services/scheduleServices";
import { getAllClasses } from "@/features/classes/services/classServices";
import { CreateRoomDto } from "@/features/room/types/room";
import { ExamDto } from "@/features/exam/types/exam.type";
import { ExamScheduleDto } from "@/features/schedule/types/schedule";
import { ClassResponseDto } from "@/features/classes/types/class.type";
import { ROOM_FORM_VALIDATION, DEFAULT_MAX_PARTICIPANTS, ROOM_CODE_PREFIX } from "../data/roomConstants";
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

const AddRoomPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [exams, setExams] = useState<ExamDto[]>([]);
  const [schedules, setSchedules] = useState<ExamScheduleDto[]>([]);
  const [classes, setClasses] = useState<ClassResponseDto[]>([]);
  const [availableClasses, setAvailableClasses] = useState<ClassResponseDto[]>([]);
  const [filteredExams, setFilteredExams] = useState<ExamDto[]>([]);
  const [selectedScheduleSubject, setSelectedScheduleSubject] = useState<{id: number, name: string, code: string} | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CreateRoomDto>({
    defaultValues: {
      randomizeOrder: false,
      status: 'waiting',
      maxParticipants: DEFAULT_MAX_PARTICIPANTS,
    }
  });

  const selectedExamId = watch("examId");
  const selectedScheduleId = watch("examScheduleId");
  const selectedClassId = watch("classId");

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsData, schedulesData, classesData] = await Promise.all([
          getAllExams(),
          getSchedulesByStatus('active'),
          getAllClasses(),
        ]);
        setExams(examsData);
        setSchedules(schedulesData);
        setClasses(classesData);
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

  // Update available classes and filter exams when schedule is selected
  useEffect(() => {
    if (selectedScheduleId) {
      const scheduleId = parseInt(selectedScheduleId.toString());
      const selectedSchedule = schedules.find(s => s.id === scheduleId);
      
      // Reset exam selection when schedule changes
      setValue("examId", 0, { shouldValidate: false });
      
      const fetchClassesForSchedule = async () => {
        try {
          const classesData = await getClassesByScheduleId(scheduleId);
          setAvailableClasses(classesData);
          
          const currentClassId = selectedClassId ? parseInt(selectedClassId.toString()) : null;
          if (currentClassId && !classesData.some((c: ClassResponseDto) => c.id === currentClassId)) {
            setValue("classId", 0, { shouldValidate: false });
          }
        } catch (error) {
          console.error("Failed to fetch classes for schedule:", error);
          setAvailableClasses([]);
          toast({
            title: "Lỗi khi tải danh sách lớp học",
            variant: "error",
          });
        }
      };

      fetchClassesForSchedule();
      
      // Filter exams by subject from the selected schedule
      if (selectedSchedule?.subject) {
        setSelectedScheduleSubject(selectedSchedule.subject);
        // Filter official exams that match the subject of the selected schedule
        const matchingExams = exams.filter(exam => 
          exam.examType === 'official' && 
          exam.subject?.id === selectedSchedule.subject?.id
        );
        setFilteredExams(matchingExams);
      } else {
        setSelectedScheduleSubject(null);
        setFilteredExams([]);
      }
    } else {
      setAvailableClasses([]);
      setFilteredExams([]);
      setSelectedScheduleSubject(null);
    }
  }, [selectedScheduleId, schedules, exams, setValue]);

  // Auto-generate room code when exam, schedule, and class are selected
  useEffect(() => {
    if (selectedExamId && selectedScheduleId && selectedClassId) {
      const exam = exams.find(e => e.id === parseInt(selectedExamId.toString()));
      const schedule = schedules.find(s => s.id === parseInt(selectedScheduleId.toString()));
      const cls = classes.find(c => c.id === parseInt(selectedClassId.toString()));
      
      if (exam && schedule && cls) {
        const examCode = exam.name.substring(0, 3).toUpperCase();
        const scheduleCode = schedule.code ? schedule.code.substring(0, 3).toUpperCase() : 'SCH';
        const classCode = cls.code || cls.name.substring(0, 3).toUpperCase();
        const timestamp = Date.now().toString().slice(-4);
        
        const generatedCode = `${ROOM_CODE_PREFIX}_${examCode}_${scheduleCode}_${classCode}_${timestamp}`;
        setValue("code", generatedCode);
      }
    }
  }, [selectedExamId, selectedScheduleId, selectedClassId, exams, schedules, classes, setValue]);

  const onSubmit = async (data: CreateRoomDto, exitAfterSave = false) => {
    try {
      setIsLoading(true);

      // Validate required fields
      if (!data.examId) {
        toast({
          title: "Lỗi validation",
          description: "Vui lòng chọn bài thi.",
          variant: "error",
        });
        return;
      }

      if (!data.examScheduleId) {
        toast({
          title: "Lỗi validation",
          description: "Vui lòng chọn lịch thi.",
          variant: "error",
        });
        return;
      }

      if (!data.classId) {
        toast({
          title: "Lỗi validation",
          description: "Vui lòng chọn lớp học.",
          variant: "error",
        });
        return;
      }

      if (!data.code || data.code.trim() === '') {
        toast({
          title: "Lỗi validation",
          description: "Vui lòng nhập mã phòng thi.",
          variant: "error",
        });
        return;
      }

      const roomData: CreateRoomDto = {
        code: data.code.trim(),
        randomizeOrder: data.randomizeOrder || false,
        status: data.status || 'waiting',
        description: data.description?.trim() || '',
        examId: data.examId,
        examScheduleId: data.examScheduleId,
        classId: data.classId,
        maxParticipants: data.maxParticipants || 30,
      };

      // Validate data types before sending
      console.log('Room data before sending:', {
        ...roomData,
        examId_type: typeof roomData.examId,
        examScheduleId_type: typeof roomData.examScheduleId,
        classId_type: typeof roomData.classId,
        maxParticipants_type: typeof roomData.maxParticipants,
      });

      // Ensure all IDs are numbers
      if (isNaN(roomData.examId) || isNaN(roomData.examScheduleId) || isNaN(roomData.classId)) {
        toast({
          title: "Lỗi dữ liệu",
          description: "Có lỗi với dữ liệu được chọn. Vui lòng thử lại.",
          variant: "error",
        });
        return;
      }

      const response = await createRoom(roomData);

      toast({
        title: "Tạo phòng thi thành công!",
        description: `Phòng thi "${response.code}" đã được tạo thành công.`,
      });

      if (exitAfterSave) {
        router.push("/dashboard/room");
      } else {
        router.push(`/dashboard/room/edit/${response.id}`);
      }

      reset();
    } catch (error: unknown) {
      console.error("Error creating room:", error);
      
      let errorMessage = "Vui lòng kiểm tra lại thông tin và thử lại.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        const errorObj = error as { 
          response?: { 
            data?: { 
              message?: string; 
              error?: string; 
            } 
          } 
        };
        if (errorObj.response?.data?.message) {
          errorMessage = errorObj.response.data.message;
        } else if (errorObj.response?.data?.error) {
          errorMessage = errorObj.response.data.error;
        }
      }

      toast({
        title: "Lỗi khi tạo phòng thi",
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <NavigableBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard", isHome: true },
          { label: "Phòng thi", href: "/dashboard/room" },
          { label: "Thêm phòng thi", isActive: true },
        ]}
      />

      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="p-2 bg-white/20 rounded-full">
            <MeetingRoom className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Thêm phòng thi mới</h1>
        </div>
        <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
          Tạo phòng thi mới cho kỳ thi với đầy đủ thông tin cần thiết
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
                Điền thông tin chi tiết để tạo phòng thi mới
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 p-8">
          <form onSubmit={handleSubmit((data) => onSubmit(data, true))} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Thông tin cơ bản
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="code" className="text-sm font-medium text-gray-700">
                    Mã phòng thi <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="code"
                    {...register("code", ROOM_FORM_VALIDATION.code)}
                    placeholder="Nhập mã phòng thi"
                    className={`h-11 ${errors.code ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"} transition-colors`}
                  />
                  {errors.code && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.code.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="status" className="text-sm font-medium text-gray-700">Trạng thái</Label>
                  <Select
                    value={watch("status")}
                    onValueChange={(value: 'waiting' | 'open' | 'closed') => setValue("status", value)}
                  >
                    <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="waiting">🟡 Chờ mở</SelectItem>
                      <SelectItem value="open">🟢 Đang mở</SelectItem>
                      <SelectItem value="closed">🔴 Đã đóng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Exam, Schedule, Class Selection */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Lựa chọn lịch thi và bài thi
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="examScheduleId" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    📅 Lịch thi <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedScheduleId?.toString()}
                    onValueChange={(value) => setValue("examScheduleId", parseInt(value))}
                  >
                    <SelectTrigger className={`h-11 transition-colors ${errors.examScheduleId ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}>
                      <div className="flex items-center gap-2 w-full overflow-hidden">
                        {selectedScheduleId && schedules.length > 0 ? (
                          <>
                            <span className="flex-shrink-0">🗓️</span>
                            <span className="truncate text-sm">
                              {schedules.find(s => s.id === parseInt(selectedScheduleId.toString()))?.code || "Chọn lịch thi"}
                            </span>
                          </>
                        ) : (
                          <SelectValue placeholder="Chọn lịch thi" />
                        )}
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {schedules.map((schedule) => (
                        <SelectItem key={schedule.id} value={schedule.id.toString()}>
                          <div className="flex items-center gap-2 w-full overflow-hidden">
                            <span className="flex-shrink-0">🗓️</span>
                            <span className="truncate text-sm" title={`${schedule.code} ${schedule.subject ? `- ${schedule.subject.name}` : ''}`}>
                              {schedule.code} {schedule.subject && `- ${schedule.subject.name}`}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.examScheduleId && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      Vui lòng chọn lịch thi
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="examId" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    📝 Bài thi <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedExamId?.toString()}
                    onValueChange={(value) => setValue("examId", parseInt(value))}
                    disabled={!selectedScheduleId}
                  >
                    <SelectTrigger className={`h-11 transition-colors ${errors.examId ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}>
                      <div className="flex items-center gap-2 w-full overflow-hidden">
                        {selectedExamId && filteredExams.length > 0 ? (
                          <>
                            <span className="flex-shrink-0">🏆</span>
                            <span className="truncate text-sm">
                              {filteredExams.find(exam => exam.id === parseInt(selectedExamId.toString()))?.name || "Chọn bài thi"}
                            </span>
                          </>
                        ) : (
                          <SelectValue placeholder={selectedScheduleId ? "Chọn bài thi" : "Chọn lịch thi trước"} />
                        )}
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {selectedScheduleSubject ? (
                        filteredExams.length > 0 ? (
                          filteredExams.map((exam) => (
                            <SelectItem key={exam.id} value={exam.id.toString()}>
                              <div className="flex items-center gap-2 w-full overflow-hidden">
                                <span className="flex-shrink-0">🏆</span>
                                <span className="truncate text-sm" title={exam.name}>
                                  {exam.name}
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-exams" disabled>
                            Không có đề thi nào cho môn {selectedScheduleSubject.name}
                          </SelectItem>
                        )
                      ) : (
                        <SelectItem value="select-schedule" disabled>
                          Vui lòng chọn lịch thi trước
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.examId && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      Vui lòng chọn bài thi
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="classId" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    👥 Lớp học <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedClassId?.toString()}
                    onValueChange={(value) => setValue("classId", parseInt(value))}
                    disabled={!selectedScheduleId}
                  >
                    <SelectTrigger className={`h-11 transition-colors ${errors.classId ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}>
                      <div className="flex items-center gap-2 w-full overflow-hidden">
                        {selectedClassId && availableClasses.length > 0 ? (
                          <>
                            <span className="flex-shrink-0">🎓</span>
                            <span className="truncate text-sm">
                              {availableClasses.find(cls => cls.id === parseInt(selectedClassId.toString()))?.name || "Chọn lớp học"}
                            </span>
                          </>
                        ) : (
                          <SelectValue placeholder={selectedScheduleId ? "Chọn lớp học" : "Chọn lịch thi trước"} />
                        )}
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {selectedScheduleId ? (
                        availableClasses.length > 0 ? (
                          availableClasses.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id.toString()}>
                              <div className="flex items-center gap-2 w-full overflow-hidden">
                                <span className="flex-shrink-0">🎓</span>
                                <span className="truncate text-sm" title={`${cls.name} (${cls.code})`}>
                                  {cls.name} ({cls.code})
                                </span>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-classes" disabled>
                            Lịch thi này không có lớp nào
                          </SelectItem>
                        )
                      ) : (
                        <SelectItem value="select-schedule" disabled>
                          Vui lòng chọn lịch thi trước
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.classId && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      Vui lòng chọn lớp học
                    </p>
                  )}
                </div>
              </div>

              {selectedScheduleSubject && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">📚</span>
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Môn học từ lịch thi: </span>
                      {selectedScheduleSubject.name} ({selectedScheduleSubject.code})
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Settings */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Cài đặt bổ sung
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="maxParticipants" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    👤 Số người tham gia tối đa
                  </Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    {...register("maxParticipants", {
                      ...ROOM_FORM_VALIDATION.maxParticipants,
                      valueAsNumber: true,
                    })}
                    placeholder="Nhập số người tối đa"
                    className={`h-11 transition-colors ${errors.maxParticipants ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                  />
                  {errors.maxParticipants && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      {errors.maxParticipants.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">⚙️ Cài đặt</Label>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
                    <Checkbox
                      id="randomizeOrder"
                      checked={watch("randomizeOrder")}
                      onCheckedChange={(checked) => setValue("randomizeOrder", !!checked)}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="randomizeOrder" className="text-sm font-normal text-gray-700 cursor-pointer">
                      🔀 Trộn thứ tự câu hỏi
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Mô tả
              </h3>
              
              <div className="space-y-3">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  📝 Mô tả phòng thi
                </Label>
                <Textarea
                  id="description"
                  {...register("description", ROOM_FORM_VALIDATION.description)}
                  placeholder="Nhập mô tả cho phòng thi (tùy chọn)"
                  rows={4}
                  className={`transition-colors resize-none ${errors.description ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.description.message}
                  </p>
                )}
              </div>
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
                  {isLoading ? "Đang lưu..." : "Lưu và tiếp tục chỉnh sửa"}
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

export default AddRoomPage; 