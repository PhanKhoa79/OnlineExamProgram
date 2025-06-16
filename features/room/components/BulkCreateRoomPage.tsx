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
import { getSchedulesByStatus } from "@/features/schedule/services/scheduleServices";
import { getAllClasses } from "@/features/classes/services/classServices";
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
  const [classes, setClasses] = useState<ClassResponseDto[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [selectedExams, setSelectedExams] = useState<number[]>([]);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<number | 'all'>('all');

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

  useEffect(() => {
    setValue("examIds", selectedExams);
    setValue("classIds", selectedClasses);
  }, [selectedExams, selectedClasses, setValue]);

  // Reset selected exams when filter changes to avoid selecting exams not visible
  useEffect(() => {
    if (selectedSubjectFilter !== 'all') {
      const filteredExamIds = filteredExams.map(exam => exam.id);
      const validSelectedExams = selectedExams.filter(examId => filteredExamIds.includes(examId));
      if (validSelectedExams.length !== selectedExams.length) {
        setSelectedExams(validSelectedExams);
      }
    }
  }, [selectedSubjectFilter, filteredExams, selectedExams]);

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
    const filteredExamIds = filteredExams.map(exam => exam.id);
    const newSelectedExams = selectedExams.filter(examId => !filteredExamIds.includes(examId));
    setSelectedExams(newSelectedExams);
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
    const allClassIds = classes.map(cls => cls.id);
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
                        {schedule.code}
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
          </CardContent>
        </Card>

        {/* Exam Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Chọn đề thi</CardTitle>
            <CardDescription>
              Chọn các đề thi để phân phối ngẫu nhiên cho các lớp học. Số lượng đề thi phải bằng số lượng lớp học.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2 items-center flex-wrap">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllExams}
                  >
                    Chọn tất cả
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDeselectAllExams}
                  >
                    Bỏ chọn tất cả
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Label htmlFor="subjectFilter" className="text-sm whitespace-nowrap">Lọc theo môn:</Label>
                  <Select
                    value={selectedSubjectFilter.toString()}
                    onValueChange={(value) => setSelectedSubjectFilter(value === 'all' ? 'all' : parseInt(value))}
                  >
                    <SelectTrigger className="w-48">
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
                </div>
                
                <div className="ml-auto text-sm text-gray-500">
                  Đã chọn: {selectedExams.length}/{filteredExams.length} đề thi
                  {selectedSubjectFilter !== 'all' && (
                    <span className="ml-1 text-blue-600">
                      (đã lọc từ {exams.length} đề thi)
                    </span>
                  )}
                </div>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Chọn</TableHead>
                      <TableHead>Tên đề thi</TableHead>
                      <TableHead>Môn học</TableHead>
                      <TableHead>Loại đề thi</TableHead>
                      <TableHead>Thời gian</TableHead>
                      <TableHead>Số câu hỏi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExams.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          {selectedSubjectFilter === 'all' 
                            ? 'Không có đề thi nào' 
                            : 'Không có đề thi nào cho môn học đã chọn'
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
                            <TableCell className="font-medium">{exam.name}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{exam.subject?.name}</span>
                                <span className="text-xs text-gray-500">{exam.subject?.code}</span>
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
                >
                  Chọn tất cả
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDeselectAllClasses}
                >
                  Bỏ chọn tất cả
                </Button>
                <div className="ml-auto text-sm text-gray-500">
                  Đã chọn: {selectedClasses.length}/{classes.length} lớp
                </div>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Chọn</TableHead>
                      <TableHead>Tên lớp</TableHead>
                      <TableHead>Mã lớp</TableHead>
                      <TableHead>Mã phòng thi sẽ tạo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes.map((cls) => {
                      const isSelected = selectedClasses.includes(cls.id);
                      
                      return (
                        <TableRow key={cls.id}>
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) => handleClassToggle(cls.id, !!checked)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{cls.name}</TableCell>
                          <TableCell>{cls.code}</TableCell>
                          <TableCell className="text-sm text-gray-500">
                            Sẽ được phân phối ngẫu nhiên
                          </TableCell>
                        </TableRow>
                      );
                    })}
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