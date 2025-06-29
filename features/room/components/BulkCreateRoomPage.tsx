"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/hooks/use-toast";
import { NavigableBreadcrumb } from "@/components/ui/NavigableBreadcrumb";
import { bulkCreateRooms } from "@/features/room/services/roomServices";
import { getAllExams } from "@/features/exam/services/examServices";
import { getSchedulesByStatus, getClassesByScheduleId } from "@/features/schedule/services/scheduleServices";
import { BulkCreateRoomDto } from "@/features/room/types/room";
import { ExamDto } from "@/features/exam/types/exam.type";
import { ExamScheduleDto } from "@/features/schedule/types/schedule";
import { ClassResponseDto } from "@/features/classes/types/class.type";
import { DEFAULT_MAX_PARTICIPANTS } from "../data/roomConstants";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Save, ArrowLeft, Add } from "@mui/icons-material";

interface BulkCreateFormData {
  examScheduleId: number;
  examIds: number[];
  classIds: number[];
  randomizeOrder: boolean;
  description: string;
  maxParticipants: number;
}

const BulkCreateRoomPage: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [exams, setExams] = useState<ExamDto[]>([]);
  const [schedules, setSchedules] = useState<ExamScheduleDto[]>([]);
  const [availableClasses, setAvailableClasses] = useState<ClassResponseDto[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [selectedExams, setSelectedExams] = useState<number[]>([]);
  const [filteredExams, setFilteredExams] = useState<ExamDto[]>([]);
  const [selectedScheduleSubject, setSelectedScheduleSubject] = useState<{id: number, name: string, code: string} | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BulkCreateFormData>({
    defaultValues: {
      randomizeOrder: false,
      maxParticipants: DEFAULT_MAX_PARTICIPANTS,
      classIds: [],
      examIds: [],
    }
  });

  const selectedScheduleId = watch("examScheduleId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsData, schedulesData] = await Promise.all([
          getAllExams(),
          getSchedulesByStatus('active'),
        ]);
        setExams(examsData);
        setSchedules(schedulesData);
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
      
      // Reset selected exams when schedule changes
      setSelectedExams([]);
      
      const fetchClassesForSchedule = async () => {
        try {
          const classesData = await getClassesByScheduleId(scheduleId);
          setAvailableClasses(classesData);
          
          // Update selected classes to only include available ones
          setSelectedClasses(prevSelected => {
            const validSelectedClasses = prevSelected.filter(classId => 
              classesData.some((c: ClassResponseDto) => c.id === classId)
            );
            
            return validSelectedClasses;
          });
        } catch (error) {
          console.error("Failed to fetch classes for schedule:", error);
          setAvailableClasses([]);
          setSelectedClasses([]);
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
      setSelectedClasses([]);
      setFilteredExams([]);
      setSelectedScheduleSubject(null);
    }
  }, [selectedScheduleId, schedules, exams]);

  useEffect(() => {
    setValue("examIds", selectedExams);
    setValue("classIds", selectedClasses);
  }, [selectedExams, selectedClasses, setValue]);

  const handleExamToggle = (examId: number, checked: boolean) => {
    let newSelectedExams: number[];
    
    if (checked) {
      newSelectedExams = [...selectedExams, examId];
    } else {
      newSelectedExams = selectedExams.filter(id => id !== examId);
    }
    
    setSelectedExams(newSelectedExams);
  };

  const handleSelectAllExams = () => {
    // Select all exams from current filtered list
    const filteredExamIds = filteredExams.map(exam => exam.id);
    const newSelectedExams = [...new Set([...selectedExams, ...filteredExamIds])];
    setSelectedExams(newSelectedExams);
  };

  const handleDeselectAllExams = () => {
    // Deselect all exams from current filtered list
    setSelectedExams([]);
  };

  const handleClassToggle = (classId: number, checked: boolean) => {
    let newSelectedClasses: number[];
    
    if (checked) {
      newSelectedClasses = [...selectedClasses, classId];
    } else {
      newSelectedClasses = selectedClasses.filter(id => id !== classId);
    }
    
    setSelectedClasses(newSelectedClasses);
  };

  const handleSelectAllClasses = () => {
    const allClassIds = availableClasses.map(cls => cls.id);
    setSelectedClasses(allClassIds);
    setValue("classIds", allClassIds);
  };

  const handleDeselectAllClasses = () => {
    setSelectedClasses([]);
    setValue("classIds", []);
  };

  const onSubmit = async (data: BulkCreateFormData) => {
    try {
      if (selectedClasses.length === 0) {
        toast({
          title: "Vui lòng chọn ít nhất một lớp học",
          variant: "error",
        });
        return;
      }

      if (selectedExams.length === 0) {
        toast({
          title: "Vui lòng chọn ít nhất một đề thi",
          variant: "error",
        });
        return;
      }

      setIsLoading(true);

      const bulkData: BulkCreateRoomDto = {
        examScheduleId: data.examScheduleId,
        examIds: selectedExams,
        classIds: selectedClasses,
        randomizeOrder: data.randomizeOrder,
        description: data.description,
        maxParticipants: data.maxParticipants,
      };

      const response = await bulkCreateRooms(bulkData);

      toast({
        title: "Tạo phòng thi hàng loạt thành công!",
        description: `Đã tạo ${response.length} phòng thi với phân phối đề ngẫu nhiên cho ${selectedClasses.length} lớp học.`,
      });

      router.push("/dashboard/room");
    } catch (error) {
      console.error("Error bulk creating rooms:", error);
      toast({
        title: "Lỗi khi tạo phòng thi hàng loạt",
        description: "Vui lòng kiểm tra lại thông tin và thử lại.",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/room");
  };

  const selectedSchedule = schedules.find(schedule => schedule.id === selectedScheduleId);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <NavigableBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard", isHome: true },
          { label: "Phòng thi", href: "/dashboard/room" },
          { label: "Tạo phòng thi hàng loạt", isActive: true },
        ]}
      />

      <div className="text-center space-y-3 py-6">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-lg">
          <Add className="h-6 w-6" />
          <h1 className="text-2xl font-bold tracking-tight">Tạo phòng thi hàng loạt</h1>
        </div>
        <p className="text-lg text-gray-600 font-medium">
          Tạo nhiều phòng thi cùng lúc cho các lớp học khác nhau
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Cài đặt cơ bản</CardTitle>
            <CardDescription>
              Chọn lịch thi và cài đặt chung cho tất cả phòng thi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="examScheduleId">
                  Lịch thi <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedScheduleId?.toString()}
                  onValueChange={(value) => setValue("examScheduleId", parseInt(value))}
                >
                  <SelectTrigger className={errors.examScheduleId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Chọn lịch thi" />
                  </SelectTrigger>
                  <SelectContent>
                    {schedules.map((schedule) => (
                      <SelectItem key={schedule.id} value={schedule.id.toString()}>
                        {schedule.code} {schedule.subject && `- ${schedule.subject.name}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.examScheduleId && (
                  <p className="text-sm text-red-500">Vui lòng chọn lịch thi</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Số người tham gia tối đa</Label>
                <input
                  id="maxParticipants"
                  type="number"
                  {...register("maxParticipants", {
                    min: { value: 1, message: "Số người tham gia tối thiểu là 1" },
                    max: { value: 100, message: "Số người tham gia tối đa là 100" }
                  })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Nhập số người tối đa"
                />
                {errors.maxParticipants && (
                  <p className="text-sm text-red-500">{errors.maxParticipants.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả chung</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Nhập mô tả chung cho tất cả phòng thi (tùy chọn)"
                  rows={2}
                />
              </div>
            </div>
            
            {selectedScheduleSubject && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">📚</span>
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Môn học từ lịch thi: </span>
                    {selectedScheduleSubject.name} ({selectedScheduleSubject.code})
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exam Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Chọn đề thi</CardTitle>
            <CardDescription>
              Chọn các đề thi để phân phối ngẫu nhiên cho các lớp học. Số lượng đề thi phải bằng số lượng lớp học.
              {!selectedScheduleId && " Hãy chọn lịch thi trước."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllExams}
                    disabled={!selectedScheduleId || filteredExams.length === 0}
                  >
                    Chọn tất cả
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDeselectAllExams}
                    disabled={selectedExams.length === 0}
                  >
                    Bỏ chọn tất cả
                  </Button>
                </div>
                
                <div className="sm:ml-auto text-sm text-gray-500 font-medium">
                  Đã chọn: {selectedExams.length}/{filteredExams.length} đề thi
                </div>
              </div>

              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 min-w-[48px]">Chọn</TableHead>
                      <TableHead className="min-w-[200px]">Tên đề thi</TableHead>
                      <TableHead className="min-w-[120px]">Môn học</TableHead>
                      <TableHead className="min-w-[100px]">Loại đề thi</TableHead>
                      <TableHead className="min-w-[80px]">Thời gian</TableHead>
                      <TableHead className="min-w-[80px]">Số câu hỏi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!selectedScheduleId ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          Vui lòng chọn lịch thi trước
                        </TableCell>
                      </TableRow>
                    ) : filteredExams.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          {selectedScheduleSubject 
                            ? `Không có đề thi nào cho môn ${selectedScheduleSubject.name}` 
                            : 'Không có đề thi nào cho lịch thi đã chọn'
                          }
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExams.map((exam) => {
                        const isSelected = selectedExams.includes(exam.id);
                        
                        return (
                          <TableRow key={exam.id}>
                            <TableCell>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => handleExamToggle(exam.id, !!checked)}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="max-w-[200px] truncate" title={exam.name}>
                                {exam.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col max-w-[120px]">
                                <span className="font-medium truncate" title={exam.subject?.name}>
                                  {exam.subject?.name}
                                </span>
                                <span className="text-xs text-gray-500 truncate" title={exam.subject?.code}>
                                  {exam.subject?.code}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                exam.examType === 'practice' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {exam.examType === 'practice' ? 'Luyện tập' : 'Chính thức'}
                              </span>
                            </TableCell>
                            <TableCell>{exam.duration} phút</TableCell>
                            <TableCell>{exam.totalQuestions} câu</TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Class Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Chọn lớp học</CardTitle>
            <CardDescription>
              Chọn các lớp học để tạo phòng thi. Mỗi lớp sẽ có một phòng thi riêng.
              {selectedScheduleId ? (
                availableClasses.length > 0 ? 
                  ` Hiển thị ${availableClasses.length} lớp học của lịch thi đã chọn.` :
                  " Lịch thi đã chọn không có lớp học nào."
              ) : " Hãy chọn lịch thi trước."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllClasses}
                  disabled={availableClasses.length === 0}
                >
                  Chọn tất cả
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDeselectAllClasses}
                  disabled={selectedClasses.length === 0}
                >
                  Bỏ chọn tất cả
                </Button>
                <div className="ml-auto text-sm text-gray-500">
                  Đã chọn: {selectedClasses.length}/{availableClasses.length} lớp
                </div>
              </div>

              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 min-w-[48px]">Chọn</TableHead>
                      <TableHead className="min-w-[150px]">Tên lớp</TableHead>
                      <TableHead className="min-w-[100px]">Mã lớp</TableHead>
                      <TableHead className="min-w-[150px]">Mã phòng thi sẽ tạo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {availableClasses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                          {selectedScheduleId ? 
                            "Lịch thi đã chọn không có lớp học nào" : 
                            "Hãy chọn lịch thi trước"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      availableClasses.map((cls) => {
                        const isSelected = selectedClasses.includes(cls.id);
                        
                        return (
                          <TableRow key={cls.id}>
                            <TableCell>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => handleClassToggle(cls.id, !!checked)}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="max-w-[150px] truncate" title={cls.name}>
                                {cls.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-[100px] truncate" title={cls.code}>
                                {cls.code}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">
                              Sẽ được phân phối ngẫu nhiên
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validation Warning */}
        {(selectedExams.length > 0 || selectedClasses.length > 0) && selectedExams.length !== selectedClasses.length && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-yellow-800">
                <div className="h-4 w-4 rounded-full bg-yellow-400 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">!</span>
                </div>
                <p className="font-medium">
                  Số lượng đề thi ({selectedExams.length}) phải nhỏ hơn hoặc bằng số lượng lớp ({selectedClasses.length}) để có thể tạo phòng thi.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {selectedClasses.length > 0 && selectedExams.length > 0 && selectedExams.length === selectedClasses.length && selectedSchedule && (
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Lịch thi:</strong> {selectedSchedule.code}</p>
                {selectedScheduleSubject && (
                  <p><strong>Môn học:</strong> {selectedScheduleSubject.name} ({selectedScheduleSubject.code})</p>
                )}
                <p><strong>Số đề thi được chọn:</strong> {selectedExams.length}</p>
                <p><strong>Số lớp được chọn:</strong> {selectedClasses.length}</p>
                <p><strong>Số phòng thi sẽ tạo:</strong> {selectedClasses.length}</p>
                <p><strong>Phân phối đề thi:</strong> Ngẫu nhiên cho từng lớp</p>
                <p><strong>Trộn câu hỏi:</strong> {watch("randomizeOrder") ? "Có" : "Không"}</p>
                <p><strong>Số người tối đa mỗi phòng:</strong> {watch("maxParticipants")}</p>
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <p className="text-blue-800 text-xs">
                    <strong>Lưu ý:</strong> Mỗi lớp sẽ được phân một đề thi khác nhau một cách ngẫu nhiên từ danh sách đề thi đã chọn.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Hủy
          </Button>
          
          <Button
            type="submit"
            disabled={isLoading || selectedClasses.length === 0 || selectedExams.length === 0}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isLoading ? "Đang tạo..." : `Tạo ${selectedClasses.length} phòng thi với phân phối đề ngẫu nhiên`}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BulkCreateRoomPage; 