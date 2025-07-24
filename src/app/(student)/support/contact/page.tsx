'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Users,
  HelpCircle,
  Settings,
  Bug,
  Lightbulb,
  Globe,
  Facebook,
  MessageSquare
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { toast } from '@/components/hooks/use-toast';

export default function ContactPage() {
  usePageTitle('Liên hệ hỗ trợ');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    priority: '',
    message: '',
    attachments: null as File[] | null
  });

  const supportChannels = [
    {
      title: 'Hotline hỗ trợ',
      description: 'Gọi trực tiếp để được hỗ trợ ngay lập tức',
      contact: '1900 123 456',
      hours: '24/7',
      icon: <Phone className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      badge: 'Ưu tiên'
    },
    {
      title: 'Email hỗ trợ',
      description: 'Gửi email chi tiết về vấn đề của bạn',
      contact: 'support@megastar.vn',
      hours: 'Phản hồi trong 2-4h',
      icon: <Mail className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      badge: 'Phổ biến'
    },
    {
      title: 'Chat trực tuyến',
      description: 'Trò chuyện trực tiếp với đội ngũ hỗ trợ',
      contact: 'Bắt đầu chat',
      hours: '8:00 - 22:00',
      icon: <MessageCircle className="w-6 h-6" />,
      color: 'from-purple-500 to-indigo-500',
      badge: 'Nhanh nhất'
    }
  ];

  const supportTeam = [
    {
      name: 'Nguyễn Văn Hưng',
      role: 'Trưởng nhóm hỗ trợ',
      avatar: 'H',
      speciality: 'Hỗ trợ tổng quát, Tài khoản'
    },
    {
      name: 'Trần Thị Mai',
      role: 'Chuyên viên kỹ thuật',
      avatar: 'M',
      speciality: 'Lỗi kỹ thuật, Hiệu suất'
    },
    {
      name: 'Lê Văn Minh',
      role: 'Chuyên viên đào tạo',
      avatar: 'L',
      speciality: 'Hướng dẫn sử dụng, Đào tạo'
    }
  ];

  const issueCategories = [
    { value: 'account', label: 'Tài khoản & Đăng nhập', icon: <Users className="w-4 h-4" /> },
    { value: 'exam', label: 'Bài thi & Kết quả', icon: <HelpCircle className="w-4 h-4" /> },
    { value: 'technical', label: 'Lỗi kỹ thuật', icon: <Bug className="w-4 h-4" /> },
    { value: 'feature', label: 'Tính năng mới', icon: <Lightbulb className="w-4 h-4" /> },
    { value: 'other', label: 'Khác', icon: <Settings className="w-4 h-4" /> }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Thấp', color: 'text-green-600 bg-green-100' },
    { value: 'normal', label: 'Bình thường', color: 'text-blue-600 bg-blue-100' },
    { value: 'high', label: 'Cao', color: 'text-orange-600 bg-orange-100' },
    { value: 'urgent', label: 'Khẩn cấp', color: 'text-red-600 bg-red-100' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        variant: 'error'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Gửi thành công!',
        description: 'Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất',
        variant: 'success'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: '',
        priority: '',
        message: '',
        attachments: null
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra, vui lòng thử lại sau',
        variant: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Liên hệ hỗ trợ
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy chọn cách liên hệ phù hợp nhất
        </p>
      </div>

      {/* Support Channels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {supportChannels.map((channel, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 bg-gradient-to-br ${channel.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <div className="text-white">
                      {channel.icon}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {channel.badge}
                  </Badge>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {channel.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {channel.description}
                  </p>
                  <div className="space-y-2">
                    <div className="font-medium text-blue-600 dark:text-blue-400">
                      {channel.contact}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {channel.hours}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                Gửi yêu cầu hỗ trợ
              </CardTitle>
              <CardDescription>
                Điền thông tin chi tiết để chúng tôi có thể hỗ trợ bạn tốt nhất
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên *</Label>
                    <Input
                      id="name"
                      placeholder="Nhập họ tên của bạn"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Tiêu đề *</Label>
                  <Input
                    id="subject"
                    placeholder="Mô tả ngắn gọn vấn đề của bạn"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Danh mục vấn đề</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {issueCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center gap-2">
                              {category.icon}
                              <span>{category.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Mức độ ưu tiên</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn mức độ" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityLevels.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            <Badge variant="outline" className={priority.color}>
                              {priority.label}
                            </Badge>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mô tả chi tiết *</Label>
                  <Textarea
                    id="message"
                    placeholder="Hãy mô tả chi tiết vấn đề của bạn, bao gồm các bước đã thực hiện và thông báo lỗi (nếu có)..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-gray-500">
                    * Thông tin bắt buộc
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Gửi yêu cầu
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Support Team */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Đội ngũ hỗ trợ</CardTitle>
              <CardDescription>
                Gặp gỡ những người sẽ hỗ trợ bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {supportTeam.map((member, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                      {member.name}
                    </h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                      {member.role}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {member.speciality}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Phản hồi trung bình: 2-4 giờ</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Giải quyết trong ngày: 95%</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Hỗ trợ 24/7 qua hotline</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Đội ngũ chuyên nghiệp</span>
              </div>
            </CardContent>
          </Card>

          {/* Social Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hỗ trợ qua mạng xã hội</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Facebook className="w-4 h-4 mr-2 text-blue-600" />
                Facebook Page
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="w-4 h-4 mr-2 text-green-600" />
                Zalo Support
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="w-4 h-4 mr-2 text-gray-600" />
                Website
              </Button>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="border-red-200 bg-red-50/50 dark:bg-red-900/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900 dark:text-red-400 text-sm">
                    Vấn đề khẩn cấp?
                  </h4>
                  <p className="text-red-700 dark:text-red-300 text-xs mt-1 mb-2">
                    Gọi ngay hotline để được hỗ trợ tức thì
                  </p>
                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                    <Phone className="w-3 h-3 mr-1" />
                    1900 123 456
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 