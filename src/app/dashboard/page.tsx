import { UsersIcon, DocumentTextIcon, AcademicCapIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

const stats = [
  { 
    name: 'Tổng học sinh', 
    stat: '1,200', 
    icon: UsersIcon, 
    change: '+12%', 
    changeType: 'increase',
    description: 'Tăng so với tháng trước',
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    name: 'Bài kiểm tra đang hoạt động', 
    stat: '45', 
    icon: DocumentTextIcon, 
    change: '+8%', 
    changeType: 'increase',
    description: 'Bài kiểm tra mới được tạo',
    color: 'from-emerald-500 to-teal-500'
  },
  { 
    name: 'Tỷ lệ đậu', 
    stat: '85%', 
    icon: AcademicCapIcon, 
    change: '+5.4%', 
    changeType: 'increase',
    description: 'Cải thiện so với kỳ trước',
    color: 'from-violet-500 to-purple-500'
  },
  { 
    name: 'Điểm trung bình', 
    stat: '7.8', 
    icon: ArrowTrendingUpIcon, 
    change: '+2.1%', 
    changeType: 'increase',
    description: 'Tăng 0.2 điểm so với tháng trước',
    color: 'from-pink-500 to-rose-500'
  },
];

const recentActivities = [
  { id: 1, action: 'Học sinh Nguyễn Văn A đã hoàn thành bài kiểm tra Toán 12', time: '5 phút trước', type: 'exam' },
  { id: 2, action: 'Giáo viên Trần Thị B đã tạo bài kiểm tra mới cho lớp 11A1', time: '15 phút trước', type: 'create' },
  { id: 3, action: 'Có 3 học sinh mới đăng ký vào hệ thống', time: '1 giờ trước', type: 'register' },
  { id: 4, action: 'Bài kiểm tra Vật lý 10 đã được kích hoạt', time: '2 giờ trước', type: 'activate' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Tổng quan hệ thống
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Thống kê tổng quan về hoạt động của hệ thống trong tháng này
            </p>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <div
            key={item.name}
            className="group relative overflow-hidden rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 animate-[slideUp_0.8s_ease-out_forwards]"
            style={{ 
              animationDelay: `${index * 150}ms`
            }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            {/* Card Content */}
            <div className="relative z-10">
              {/* Icon and Change */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}>
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className={`flex items-center text-sm font-medium px-2 py-1 rounded-full ${
                  item.changeType === 'increase' 
                    ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/30' 
                    : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                }`}>
                  {item.change}
                </div>
              </div>

              {/* Stats */}
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {item.name}
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {item.stat}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <div className="lg:col-span-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Thống kê hoạt động
            </h3>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-lg">
                7 ngày
              </button>
              <button className="px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                30 ngày
              </button>
            </div>
          </div>
          <div className="h-80 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-800">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <ArrowTrendingUpIcon className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Biểu đồ thống kê</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Sẽ được tích hợp sau</p>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/30 p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Hoạt động gần đây
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-white/40 dark:hover:bg-gray-800/40 transition-colors duration-200">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'exam' ? 'bg-blue-500' :
                  activity.type === 'create' ? 'bg-green-500' :
                  activity.type === 'register' ? 'bg-purple-500' :
                  'bg-orange-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white font-medium leading-5">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200">
            Xem tất cả hoạt động
          </button>
        </div>
      </div>
    </div>
  );
}