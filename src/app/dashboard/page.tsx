import { UsersIcon, DocumentTextIcon, AcademicCapIcon } from '@heroicons/react/24/outline';


const stats = [
  { name: 'Total Students', stat: '1,200', icon: UsersIcon, change: '+12%', changeType: 'increase' },
  { name: 'Active Exams', stat: '45', icon: DocumentTextIcon, change: '+8%', changeType: 'increase' },
  { name: 'Pass Rate', stat: '85%', icon: AcademicCapIcon, change: '+5.4%', changeType: 'increase' },
];

export default function DashboardPage() {
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Stats cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((item) => (
            <div
              key={item.name}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <item.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <span
                      className={item.changeType === 'increase' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}
                    >
                      {item.change}
                    </span>{' '}
                    <span className="text-gray-500">from last month</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}