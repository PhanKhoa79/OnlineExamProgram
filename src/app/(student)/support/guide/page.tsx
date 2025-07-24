'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  BookOpen, 
  Video, 
  Download, 
  Search, 
  PlayCircle,
  FileText,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  HelpCircle,
  Lightbulb,
  Target,
  Shield,
  BarChart3
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function GuidePage() {
  usePageTitle('Hướng dẫn sử dụng');
  const [searchTerm, setSearchTerm] = useState('');

  const guideCategories = [
    {
      id: 'getting-started',
      title: 'Bắt đầu sử dụng',
      description: 'Hướng dẫn cơ bản cho người mới',
      icon: <Target className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      articles: [
        { title: 'Tạo tài khoản và đăng nhập', duration: '5 phút', difficulty: 'Dễ' },
        { title: 'Thiết lập hồ sơ cá nhân', duration: '3 phút', difficulty: 'Dễ' },
        { title: 'Tham gia lớp học', duration: '4 phút', difficulty: 'Dễ' },
        { title: 'Làm quen với giao diện', duration: '10 phút', difficulty: 'Dễ' }
      ]
    },
    {
      id: 'taking-exams',
      title: 'Tham gia thi',
      description: 'Cách thức thi trắc nghiệm hiệu quả',
      icon: <FileText className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      articles: [
        { title: 'Cách làm bài thi chính thức', duration: '8 phút', difficulty: 'Trung bình' },
        { title: 'Làm bài thi thử để luyện tập', duration: '6 phút', difficulty: 'Dễ' },
        { title: 'Sử dụng tính năng đánh dấu câu hỏi', duration: '4 phút', difficulty: 'Dễ' },
        { title: 'Quản lý thời gian thi hiệu quả', duration: '12 phút', difficulty: 'Khó' }
      ]
    },
    {
      id: 'results-analysis',
      title: 'Xem kết quả & Phân tích',
      description: 'Hiểu và cải thiện kết quả học tập',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'from-purple-500 to-indigo-500',
      articles: [
        { title: 'Xem chi tiết kết quả bài thi', duration: '7 phút', difficulty: 'Dễ' },
        { title: 'Phân tích điểm mạnh và điểm yếu', duration: '15 phút', difficulty: 'Trung bình' },
        { title: 'Theo dõi tiến độ học tập', duration: '10 phút', difficulty: 'Trung bình' },
        { title: 'So sánh kết quả với bạn cùng lớp', duration: '8 phút', difficulty: 'Dễ' }
      ]
    },
    {
      id: 'account-security',
      title: 'Tài khoản & Bảo mật',
      description: 'Bảo vệ và quản lý tài khoản',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-red-500 to-pink-500',
      articles: [
        { title: 'Đổi mật khẩu và bảo mật tài khoản', duration: '6 phút', difficulty: 'Dễ' },
        { title: 'Xem lịch sử đăng nhập', duration: '4 phút', difficulty: 'Dễ' },
        { title: 'Cập nhật thông tin cá nhân', duration: '5 phút', difficulty: 'Dễ' },
        { title: 'Khôi phục tài khoản bị khóa', duration: '10 phút', difficulty: 'Trung bình' }
      ]
    }
  ];

  const videoTutorials = [
    {
      title: 'Hướng dẫn tổng quan hệ thống',
      description: 'Video giới thiệu toàn bộ tính năng của MegaStar Online',
      duration: '15:30',
      views: '12,450',
      thumbnail: '🎯'
    },
    {
      title: 'Cách làm bài thi hiệu quả',
      description: 'Những mẹo và thủ thuật để đạt điểm cao trong bài thi',
      duration: '8:45',
      views: '8,230',
      thumbnail: '📝'
    },
    {
      title: 'Phân tích kết quả chi tiết',
      description: 'Cách đọc hiểu và sử dụng báo cáo kết quả để cải thiện',
      duration: '12:20',
      views: '6,890',
      thumbnail: '📊'
    }
  ];

  const quickTips = [
    {
      title: 'Sử dụng phím tắt',
      description: 'Space: Chọn/bỏ chọn, Tab: Chuyển câu tiếp theo',
      icon: <Lightbulb className="w-5 h-5" />
    },
    {
      title: 'Đánh dấu câu khó',
      description: 'Click vào biểu tượng dấu sao để đánh dấu câu cần xem lại',
      icon: <Star className="w-5 h-5" />
    },
    {
      title: 'Kiểm tra kết nối',
      description: 'Đảm bảo internet ổn định trước khi bắt đầu thi',
      icon: <CheckCircle className="w-5 h-5" />
    }
  ];

  const faqItems = [
    {
      question: 'Tôi quên mật khẩu, làm sao để lấy lại?',
      answer: 'Bạn có thể click vào "Quên mật khẩu" ở trang đăng nhập, sau đó nhập email để nhận link đặt lại mật khẩu.'
    },
    {
      question: 'Bài thi bị gián đoạn do mất kết nối, tôi có thể tiếp tục không?',
      answer: 'Có, hệ thống tự động lưu tiến độ. Bạn chỉ cần đăng nhập lại và tiếp tục từ câu hỏi cuối cùng đã trả lời.'
    },
    {
      question: 'Làm sao để xem lại đáp án sau khi thi?',
      answer: 'Vào mục "Kết quả" > "Lịch sử thi", chọn bài thi muốn xem và click "Xem chi tiết" để thấy đáp án đúng.'
    },
    {
      question: 'Tôi có thể làm lại bài thi thử không?',
      answer: 'Có, bài thi thử có thể làm không giới hạn số lần. Bài thi chính thức chỉ làm được 1 lần duy nhất.'
    },
    {
      question: 'Làm sao để tham gia lớp học của giáo viên?',
      answer: 'Giáo viên sẽ cung cấp mã lớp học. Bạn vào "Trang chủ" > "Tham gia lớp" và nhập mã được cung cấp.'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Dễ': return 'bg-green-100 text-green-700 border-green-200';
      case 'Trung bình': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Khó': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredCategories = guideCategories.filter(category =>
    searchTerm === '' || 
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.articles.some(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Hướng dẫn sử dụng
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Tìm hiểu cách sử dụng MegaStar Online một cách hiệu quả nhất
        </p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Tìm kiếm hướng dẫn..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      {/* Quick Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickTips.map((tip, index) => (
          <Card key={index} className="border-l-4 border-blue-500 bg-blue-50/50 dark:bg-blue-900/10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mt-0.5">
                  {tip.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {tip.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                    {tip.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="guides" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="guides" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Hướng dẫn
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Video hướng dẫn
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            FAQ
          </TabsTrigger>
        </TabsList>

        {/* Guides Tab */}
        <TabsContent value="guides" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center`}>
                      <div className="text-white">
                        {category.icon}
                      </div>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {category.articles.map((article, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {article.duration}
                          </div>
                          <Badge variant="outline" className={`text-xs ${getDifficultyColor(article.difficulty)}`}>
                            {article.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoTutorials.map((video, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 rounded-t-lg flex items-center justify-center text-6xl">
                    {video.thumbnail}
                  </div>
                  <div className="absolute inset-0 bg-black/20 rounded-t-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <PlayCircle className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                    {video.duration}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{video.views} lượt xem</span>
                    <div className="flex items-center gap-1">
                      <PlayCircle className="w-3 h-3" />
                      Xem ngay
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Câu hỏi thường gặp
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Tìm câu trả lời nhanh cho những thắc mắc phổ biến
              </p>
            </div>
            
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg px-4"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-400 pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>

      {/* Download Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Tài liệu hướng dẫn PDF
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Tải về bản hướng dẫn đầy đủ để đọc offline
                </p>
              </div>
            </div>
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Download className="w-4 h-4 mr-2" />
              Tải về
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 