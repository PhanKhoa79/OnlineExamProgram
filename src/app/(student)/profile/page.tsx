'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth/store';
import { getStudentByEmail } from '@/features/student/services/studentService';
import { getClassById } from '@/features/classes/services/classServices';
import { StudentDto } from '@/features/student/types/student';
import { ClassResponseDto } from '@/features/classes/types/class.type';
import { uploadAvatar } from '@/features/account/services/accountService';
import { toast } from '@/components/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap,
  Camera,
  School,
  IdCard
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | undefined;
  className?: string;
}

const InfoItem = ({ icon, label, value, className = '' }: InfoItemProps) => (
  <div className={`flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl ${className}`}>
    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-base font-semibold text-gray-900 dark:text-white">{value || 'Chưa cập nhật'}</p>
    </div>
  </div>
);

export default function StudentProfilePage() {
  usePageTitle('Hồ sơ cá nhân');
  const [student, setStudent] = useState<StudentDto | null>(null);
  const [classInfo, setClassInfo] = useState<ClassResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const user = useAuthStore((state) => state.user);
  const accountname = user?.accountname;
  const email = user?.email;
  const urlAvatar = user?.urlAvatar;

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        if (!email) return;
        
        // Fetch student info
        const studentRes = await getStudentByEmail(email);
        setStudent(studentRes);
        
        // Fetch class info if student has classId
        if (studentRes.classId) {
          const classRes = await getClassById(studentRes.classId);
          setClassInfo(classRes);
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin sinh viên",
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [email]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file hình ảnh",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "Kích thước file không được vượt quá 5MB",
        variant: "error",
      });
      return;
    }

    try {
      setUploading(true);
      const newAvatarUrl = await uploadAvatar(file);
      
      // Cập nhật user state trong AuthStore
      const updatedUser = { ...user, urlAvatar: newAvatarUrl };
      useAuthStore.getState().setAuthInfo(updatedUser);
      
      toast({
        title: "Thành công",
        description: "Cập nhật ảnh đại diện thành công",
      });
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật ảnh đại diện",
        variant: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Chưa cập nhật';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Hồ sơ sinh viên</h1>
            <p className="text-blue-100">Quản lý thông tin cá nhân của bạn</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar & Basic Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={urlAvatar ? `${urlAvatar}?t=${Date.now()}` : '/avatar.png'}
                    alt="Avatar"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                </div>
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  </div>
                )}
              </div>
              <div className="text-center mt-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {student?.fullName || 'Chưa cập nhật'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {accountname}
                </p>
                {classInfo && (
                  <Badge variant="secondary" className="mt-2">
                    {classInfo.name}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IdCard className="w-5 h-5 text-blue-600" />
              Chi tiết thông tin
            </CardTitle>
            <CardDescription>
              Thông tin chi tiết về hồ sơ sinh viên
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                icon={<IdCard className="w-5 h-5 text-blue-600" />}
                label="Mã sinh viên"
                value={student?.studentCode}
              />
              <InfoItem
                icon={<User className="w-5 h-5 text-green-600" />}
                label="Giới tính"
                value={student?.gender}
              />
              <InfoItem
                icon={<Mail className="w-5 h-5 text-purple-600" />}
                label="Email"
                value={email}
              />
              <InfoItem
                icon={<Phone className="w-5 h-5 text-orange-600" />}
                label="Số điện thoại"
                value={student?.phoneNumber}
              />
              <InfoItem
                icon={<Calendar className="w-5 h-5 text-red-600" />}
                label="Ngày sinh"
                value={formatDate(student?.dateOfBirth)}
                className="md:col-span-2"
              />
              <InfoItem
                icon={<MapPin className="w-5 h-5 text-indigo-600" />}
                label="Địa chỉ"
                value={student?.address}
                className="md:col-span-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Thông tin học tập
          </CardTitle>
          <CardDescription>
            Thông tin về lớp học và quá trình học tập
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem
              icon={<School className="w-5 h-5 text-blue-600" />}
              label="Lớp học"
              value={classInfo?.name}
            />
            <InfoItem
              icon={<IdCard className="w-5 h-5 text-green-600" />}
              label="Mã lớp"
              value={classInfo?.code}
            />
            <InfoItem
              icon={<Calendar className="w-5 h-5 text-purple-600" />}
              label="Ngày tạo tài khoản"
              value={formatDate(student?.createdAt)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 