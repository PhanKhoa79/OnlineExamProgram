'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Users, 
  Award, 
  BookOpen, 
  Target, 
  TrendingUp,
  Shield,
  Clock,
  CheckCircle,
  Star,
  Play,
  BarChart3,
  Zap,
  Globe,
  Heart
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Đề thi đa dạng",
      description: "Hàng nghìn câu hỏi trắc nghiệm được cập nhật liên tục theo chương trình học mới nhất",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Thi thử không giới hạn",
      description: "Luyện tập với các đề thi thử để chuẩn bị tốt nhất cho kỳ thi chính thức",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Phân tích chi tiết",
      description: "Xem báo cáo kết quả chi tiết, theo dõi tiến độ học tập và xác định điểm yếu",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Bảo mật cao",
      description: "Hệ thống bảo mật tối ưu, đảm bảo tính công bằng và minh bạch trong quá trình thi",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Quản lý lớp học",
      description: "Giáo viên dễ dàng tạo lớp, phân công bài thi và theo dõi kết quả học sinh",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Tốc độ cao",
      description: "Giao diện mượt mà, tải nhanh, trải nghiệm thi cử không bị gián đoạn",
      color: "from-yellow-500 to-orange-500"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Học sinh đã tham gia", icon: <Users className="w-6 h-6" /> },
    { number: "500+", label: "Giáo viên tin dùng", icon: <GraduationCap className="w-6 h-6" /> },
    { number: "50,000+", label: "Bài thi đã hoàn thành", icon: <BookOpen className="w-6 h-6" /> },
    { number: "99.9%", label: "Độ tin cậy hệ thống", icon: <Award className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Nguyễn Thị Hương",
      role: "Học sinh lớp 12A1",
      content: "Hệ thống thi trắc nghiệm này đã giúp em chuẩn bị rất tốt cho kỳ thi tốt nghiệp. Giao diện đẹp, dễ sử dụng và có rất nhiều đề thi hay.",
      avatar: "H",
      rating: 5
    },
    {
      name: "Trần Văn Minh",
      role: "Giáo viên Toán",
      content: "Tôi rất hài lòng với tính năng quản lý lớp học và phân tích kết quả. Giúp tôi theo dõi tiến độ học tập của học sinh một cách hiệu quả.",
      avatar: "M",
      rating: 5
    },
    {
      name: "Lê Thị Mai",
      role: "Học sinh lớp 11B2",
      content: "Chức năng luyện tập không giới hạn rất tuyệt vời. Em có thể ôn tập mọi lúc mọi nơi và xem được kết quả chi tiết ngay lập tức.",
      avatar: "L",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MegaStar Online</h1>
                <p className="text-xs text-gray-500">Hệ thống thi trắc nghiệm</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Tính năng</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">Giới thiệu</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors">Đánh giá</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Liên hệ</a>
            </nav>
            
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Bắt đầu ngay
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                  <Star className="w-3 h-3 mr-1" />
                  Nền tảng thi trắc nghiệm hàng đầu
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Thi trắc nghiệm
                  <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    thông minh
                  </span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Nền tảng thi trắc nghiệm hiện đại với hàng nghìn câu hỏi chất lượng cao, 
                  giúp học sinh và giáo viên tối ưu hóa quá trình học tập và giảng dạy.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25">
                    <Play className="w-5 h-5 mr-2" />
                    Bắt đầu thi ngay
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-300 hover:bg-gray-50">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Tìm hiểu thêm
                </Button>
              </div>
              
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {['H', 'M', 'L', 'N', 'T'].map((letter, index) => (
                    <div key={index} className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold border-2 border-white">
                      {letter}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">10,000+ học sinh</p>
                  <p className="text-xs text-gray-500">đã tin dùng hệ thống</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Bài thi Toán học</h3>
                    <Badge className="bg-green-100 text-green-700">Đang diễn ra</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="font-medium text-gray-900 mb-2">Câu 1: Giải phương trình 2x + 3 = 7</p>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="radio" name="q1" className="text-blue-600" />
                          <span className="text-gray-700">A. x = 1</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="radio" name="q1" className="text-blue-600" defaultChecked />
                          <span className="text-gray-700">B. x = 2</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="radio" name="q1" className="text-blue-600" />
                          <span className="text-gray-700">C. x = 3</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-500">15:30 phút còn lại</span>
                      </div>
                      <div className="text-sm text-gray-500">1/20 câu</div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{width: '5%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
              Tính năng nổi bật
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Tất cả những gì bạn cần cho
              <span className="block text-blue-600">việc thi trắc nghiệm</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hệ thống được thiết kế với đầy đủ tính năng hiện đại, 
              đáp ứng mọi nhu cầu của học sinh và giáo viên
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-2">
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                  <Heart className="w-3 h-3 mr-1" />
                  Về chúng tôi
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                  Đồng hành cùng
                  <span className="block text-purple-600">giáo dục Việt Nam</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Chúng tôi cam kết mang đến nền tảng thi trắc nghiệm chất lượng cao, 
                  giúp nâng cao hiệu quả học tập và giảng dạy tại Việt Nam.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Công nghệ hiện đại</h3>
                    <p className="text-gray-600">Sử dụng công nghệ web tiên tiến, đảm bảo trải nghiệm mượt mà</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Truy cập mọi nơi</h3>
                    <p className="text-gray-600">Thi cử và quản lý từ mọi thiết bị, mọi lúc mọi nơi</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phát triển liên tục</h3>
                    <p className="text-gray-600">Cập nhật tính năng mới thường xuyên dựa trên phản hồi người dùng</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl transform -rotate-3"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 mb-1">5+</div>
                    <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 mb-1">100+</div>
                    <div className="text-sm text-gray-600">Trường học</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
                    <div className="text-sm text-gray-600">Hỗ trợ</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600 mb-1">99%</div>
                    <div className="text-sm text-gray-600">Hài lòng</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 border-indigo-200 mb-4">
              Đánh giá từ người dùng
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Họ nói gì về
              <span className="block text-indigo-600">MegaStar Online?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hàng nghìn học sinh và giáo viên đã tin tùng và đánh giá cao hệ thống của chúng tôi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">&quot;{testimonial.content}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Sẵn sàng bắt đầu hành trình học tập của bạn?
            </h2>
            <p className="text-xl text-blue-100">
              Tham gia cùng hàng nghìn học sinh và giáo viên đang sử dụng MegaStar Online để nâng cao chất lượng giáo dục
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100">
                  <Play className="w-5 h-5 mr-2" />
                  Dùng thử miễn phí
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-blue-600 hover:bg-white/10">
                <BookOpen className="w-5 h-5 mr-2" />
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">MegaStar Online</h3>
                  <p className="text-sm text-gray-400">Hệ thống thi trắc nghiệm</p>
                </div>
              </div>
              <p className="text-gray-400">
                Nền tảng thi trắc nghiệm hiện đại, 
                giúp nâng cao chất lượng giáo dục Việt Nam.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Thi trắc nghiệm</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Quản lý lớp học</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Báo cáo phân tích</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ngân hàng câu hỏi</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn sử dụng</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Liên hệ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@megastar.vn</li>
                <li>Hotline: 1900 123 456</li>
                <li>Địa chỉ: Hà Nội, Việt Nam</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MegaStar Online. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}