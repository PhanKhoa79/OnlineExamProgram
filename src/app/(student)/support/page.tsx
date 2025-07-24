'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle,
  BookOpen,
  MessageCircle,
  Video,
  Phone,
  Search,
  ArrowRight,
  Clock,
  Users,
  CheckCircle,
  Star,
  Lightbulb,
  FileText,
  Headphones,
  Globe,
  Zap
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function SupportPage() {
  usePageTitle('Hỗ trợ');
  const [searchTerm, setSearchTerm] = useState('');

  const quickHelp = [
    {
      title: 'Hướng dẫn sử dụng',
      description: 'Tài liệu chi tiết và video hướng dẫn từng bước',
      icon: <BookOpen className="w-6 h-6" />,
      href: '/support/guide',
      color: 'from-blue-500 to-cyan-500',
      badge: 'Phổ biến'
    },
    {
      title: 'Liên hệ hỗ trợ',
      description: 'Gửi yêu cầu hỗ trợ trực tiếp đến đội ngũ',
      icon: <MessageCircle className="w-6 h-6" />,
      href: '/support/contact',
      color: 'from-green-500 to-emerald-500',
      badge: 'Nhanh chóng'
    },
    {
      title: 'Video hướng dẫn',
      description: 'Học cách sử dụng qua video trực quan',
      icon: <Video className="w-6 h-6" />,
      href: '/support/guide?tab=videos',
      color: 'from-purple-500 to-indigo-500',
      badge: 'Mới'
    },
    {
      title: 'FAQ',
      description: 'Câu hỏi thường gặp và giải đáp',
      icon: <HelpCircle className="w-6 h-6" />,
      href: '/support/guide?tab=faq',
      color: 'from-orange-500 to-red-500',
      badge: 'Hữu ích'
    }
  ];

  const popularTopics = [
    {
      title: 'Cách đăng nhập và tạo tài khoản',
      description: 'Hướng dẫn chi tiết về đăng ký và đăng nhập',
      views: '2,450',
      category: 'Tài khoản'
    },
    {
      title: 'Làm bài thi trắc nghiệm hiệu quả',
      description: 'Mẹo và kỹ thuật làm bài đạt điểm cao',
      views: '1,890',
      category: 'Thi cử'
    },
    {
      title: 'Xem và phân tích kết quả',
      description: 'Cách đọc hiểu báo cáo kết quả chi tiết',
      views: '1,650',
      category: 'Kết quả'
    },
    {
      title: 'Khắc phục lỗi kết nối',
      description: 'Giải quyết các vấn đề về mạng và hiệu suất',
      views: '1,420',
      category: 'Kỹ thuật'
    },
    {
      title: 'Bảo mật tài khoản',
      description: 'Cách bảo vệ và quản lý tài khoản an toàn',
      views: '1,200',
      category: 'Bảo mật'
    }
  ];

  const supportStats = [
    { number: '24/7', label: 'Hỗ trợ liên tục', icon: <Clock className="w-5 h-5" /> },
    { number: '95%', label: 'Độ hài lòng', icon: <Star className="w-5 h-5" /> },
    { number: '<2h', label: 'Thời gian phản hồi', icon: <Zap className="w-5 h-5" /> },
    { number: '500+', label: 'Câu hỏi đã giải đáp', icon: <CheckCircle className="w-5 h-5" /> }
  ];

  const contactMethods = [
    {
      title: 'Hotline',
      value: '1900 123 456',
      description: 'Gọi trực tiếp để được hỗ trợ ngay',
      icon: <Phone className="w-5 h-5" />,
      available: 'Online',
      color: 'text-green-600'
    },
    {
      title: 'Email',
      value: 'support@megastar.vn',
      description: 'Gửi email chi tiết về vấn đề',
      icon: <MessageCircle className="w-5 h-5" />,
      available: '2-4h phản hồi',
      color: 'text-blue-600'
    },
    {
      title: 'Chat',
      value: 'Bắt đầu chat',
      description: 'Trò chuyện trực tiếp với hỗ trợ viên',
      icon: <Headphones className="w-5 h-5" />,
      available: '8:00-22:00',
      color: 'text-purple-600'
    }
  ];

  const filteredTopics = popularTopics.filter(topic =>
    searchTerm === '' || 
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
          <HelpCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Trung tâm hỗ trợ
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn. Tìm câu trả lời nhanh chóng hoặc liên hệ trực tiếp
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Tìm kiếm câu hỏi, hướng dẫn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-14 text-base bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Quick Help */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickHelp.map((item, index) => (
          <Link key={index} href={item.href}>
            <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <div className="text-white">
                        {item.icon}
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {item.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm group-hover:gap-2 transition-all">
                    <span>Xem chi tiết</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Cam kết hỗ trợ tốt nhất</h2>
          <p className="text-blue-100">Chúng tôi tự hào về chất lượng dịch vụ hỗ trợ khách hàng</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {supportStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold mb-1">{stat.number}</div>
              <div className="text-blue-100 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Popular Topics */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Chủ đề phổ biến
              </CardTitle>
              <CardDescription>
                Những câu hỏi được tìm kiếm nhiều nhất
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredTopics.map((topic, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {topic.title}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {topic.category}
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {topic.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {topic.views} lượt xem
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 mt-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Contact Methods */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Liên hệ trực tiếp</CardTitle>
              <CardDescription>
                Chọn cách liên hệ phù hợp với bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactMethods.map((method, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${method.color} bg-current/10`}>
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {method.title}
                        </h4>
                        <span className={`text-xs ${method.color} font-medium`}>
                          {method.available}
                        </span>
                      </div>
                      <p className={`font-medium text-sm ${method.color} mb-1`}>
                        {method.value}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">
                        {method.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/support/guide">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Xem hướng dẫn
                </Button>
              </Link>
              <Link href="/support/contact">
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Gửi yêu cầu hỗ trợ
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-2" />
                Gọi hotline
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Globe className="w-4 h-4 mr-2" />
                Truy cập website
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 