import { DetailedInstruction } from '@/components/ui/TabbedHelpModal';

export const classInstructions: DetailedInstruction[] = [
  {
    operation: 'create',
    title: 'Thêm lớp học mới',
    description: 'Hướng dẫn chi tiết cách tạo lớp học mới trong hệ thống quản lý',
    permission: 'class:create',
    formFields: [
      {
        name: 'className',
        label: 'Tên lớp học',
        type: 'text',
        required: true,
        description: 'Tên đầy đủ của lớp học theo quy định của trường',
        placeholder: 'Tên lớp học',
        validation: {
          field: 'className',
          rules: [
            'Bắt buộc phải nhập',
            'Nhập tên lớp đầy đủ và chính xác',
            'Nên theo format chuẩn của trường',
            'Tránh viết tắt không rõ nghĩa'
          ],
          examples: ['Công Nghệ Thông Tin K47', 'Kinh Tế A1', 'Tiếng Anh Chuyên Ngành 2024', 'Kế Toán K45']
        }
      },
      {
        name: 'codeClass',
        label: 'Mã lớp học',
        type: 'text',
        required: true,
        description: 'Mã định danh duy nhất của lớp học trong hệ thống',
        placeholder: 'Mã lớp học',
        validation: {
          field: 'codeClass',
          rules: [
            'Bắt buộc phải nhập',
            'Phải là duy nhất trong hệ thống',
            'Nên theo quy định mã lớp của trường',
            'Không được chứa ký tự đặc biệt hoặc khoảng trắng'
          ],
          examples: ['CNTT_K47', 'KT_A1_2024', 'TA_CN_01', 'KETOAN_K45']
        }
      }
    ],
    steps: [
      'Nhấn vào nút "+ Thêm lớp học" ở góc trên bên phải của trang danh sách',
      'Nhập tên lớp học đầy đủ và chính xác theo quy định',
      'Nhập mã lớp học duy nhất theo chuẩn của trường',
      'Kiểm tra lại tất cả thông tin đã nhập',
      'Nhấn "Lưu" để tạo lớp học và chuyển sang trang chỉnh sửa',
      'Hoặc nhấn "Lưu & Thoát" để tạo lớp học và quay về danh sách'
    ],
    tips: [
      'Mã lớp học nên theo chuẩn của trường để dễ quản lý',
      'Tên lớp học phải rõ ràng để dễ phân biệt',
      'Kiểm tra không trùng lặp với các lớp học đã có',
      'Nên đặt tên theo khóa học và chuyên ngành',
      'Có thể thêm năm học vào tên lớp để dễ phân biệt'
    ],
    warnings: [
      'Mã lớp học phải duy nhất trong toàn hệ thống',
      'Tên lớp học phải chính xác theo tài liệu chính thức',
      'Không thể thay đổi nhiều sau khi đã có sinh viên',
      'Chỉ admin hoặc phòng đào tạo mới có quyền tạo lớp học',
      'Lớp học mới cần được gán giáo viên chủ nhiệm'
    ],
    additionalNotes: [
      'Hệ thống sẽ tự động gán ID cho lớp học mới',
      'Lớp học mới sẽ xuất hiện trong danh sách ngay sau khi lưu',
      'Có thể chỉnh sửa thông tin lớp học sau khi tạo',
      'Cần thêm sinh viên vào lớp sau khi tạo xong'
    ]
  },
  {
    operation: 'edit',
    title: 'Chỉnh sửa thông tin lớp học',
    description: 'Hướng dẫn cách cập nhật thông tin lớp học hiện có',
    permission: 'class:update',
    formFields: [
      {
        name: 'className',
        label: 'Tên lớp học',
        type: 'text',
        required: true,
        description: 'Cập nhật tên lớp học theo tài liệu mới',
        validation: {
          field: 'className',
          rules: [
            'Bắt buộc phải nhập',
            'Cập nhật theo tài liệu chính thức mới nhất',
            'Đảm bảo chính xác để phục vụ in bằng',
            'Thông báo cho sinh viên khi có thay đổi'
          ]
        }
      },
      {
        name: 'codeClass',
        label: 'Mã lớp học',
        type: 'text',
        required: true,
        description: 'Cập nhật mã lớp học nếu cần thiết',
        validation: {
          field: 'codeClass',
          rules: [
            'Bắt buộc phải nhập',
            'Phải duy nhất trong hệ thống',
            'Cẩn thận khi thay đổi vì ảnh hưởng đến dữ liệu liên quan',
            'Nên giữ nguyên nếu đã có nhiều sinh viên'
          ]
        }
      }
    ],
    steps: [
      'Tìm lớp học cần chỉnh sửa trong bảng danh sách',
      'Nhấn vào biểu tượng bút chì (✏️) ở cột "Hành động"',
      'Trang chỉnh sửa sẽ mở với thông tin hiện tại được điền sẵn',
      'Xem lại thông tin chi tiết ở phần cuối trang',
      'Chỉnh sửa các trường cần cập nhật',
      'Kiểm tra validation realtime khi nhập liệu',
      'Nhấn "Lưu" để cập nhật và ở lại trang chỉnh sửa',
      'Hoặc nhấn "Lưu & Thoát" để cập nhật và quay về danh sách'
    ],
    tips: [
      'Chỉ thay đổi những thông tin thực sự cần thiết',
      'Kiểm tra ngày tạo và cập nhật để theo dõi lịch sử',
      'Sử dụng "Lưu" nếu muốn tiếp tục chỉnh sửa nhiều mục',
      'Thông báo cho sinh viên khi có thay đổi quan trọng',
      'Cập nhật thông tin trong các hệ thống liên quan'
    ],
    warnings: [
      'Thay đổi mã lớp học có thể ảnh hưởng đến dữ liệu liên quan',
      'Cập nhật tên lớp học cần thông báo cho các bên liên quan',
      'Chỉ admin hoặc phòng đào tạo mới có quyền chỉnh sửa',
      'Thay đổi có thể ảnh hưởng đến kế hoạch giảng dạy',
      'Kiểm tra không trùng lặp mã lớp với lớp học khác'
    ],
    additionalNotes: [
      'Thông tin cập nhật sẽ có hiệu lực ngay lập tức',
      'Hệ thống tự động ghi lại thời gian cập nhật cuối',
      'Có thể xem lịch sử thay đổi trong log hệ thống',
      'Thông tin sẽ được đồng bộ với module sinh viên'
    ]
  },
  {
    operation: 'delete',
    title: 'Xóa lớp học',
    description: 'Hướng dẫn cách xóa lớp học khỏi hệ thống',
    permission: 'class:delete',
    steps: [
      'Tìm lớp học cần xóa trong bảng danh sách',
      'Nhấn vào biểu tượng thùng rác (🗑️) ở cột "Hành động"',
      'Hộp thoại xác nhận sẽ xuất hiện với thông tin lớp học',
      'Đọc kỹ cảnh báo về hậu quả của việc xóa',
      'Nhấn "Xác nhận" để tiến hành xóa lớp học',
      'Hoặc nhấn "Hủy" để giữ lại lớp học',
      'Lớp học sẽ bị xóa vĩnh viễn khỏi hệ thống'
    ],
    tips: [
      'Kiểm tra kỹ thông tin lớp học trước khi xóa',
      'Đảm bảo không còn sinh viên nào trong lớp',
      'Backup dữ liệu quan trọng trước khi xóa',
      'Thông báo cho giáo viên chủ nhiệm về việc xóa lớp',
      'Kiểm tra lịch thi và kế hoạch học tập liên quan'
    ],
    warnings: [
      'THAO TÁC NÀY KHÔNG THỂ HOÀN TÁC!',
      'Tất cả dữ liệu liên quan đến lớp học sẽ bị mất',
      'Danh sách sinh viên trong lớp sẽ bị ảnh hưởng',
      'Lịch thi và kết quả thi của lớp sẽ bị mất',
      'Thông tin phân công giảng dạy sẽ bị xóa',
      'Chỉ admin hoặc trưởng khoa mới có quyền xóa lớp học'
    ],
    additionalNotes: [
      'Xem xét chuyển sinh viên sang lớp khác trước khi xóa',
      'Một số dữ liệu thống kê có thể vẫn lưu lại',
      'Liên hệ admin hệ thống nếu cần khôi phục dữ liệu',
      'Việc xóa sẽ được ghi log để kiểm tra sau này'
    ]
  }
];

// Permissions mapping for class feature
export const classPermissions = {
  create: 'class:create',
  edit: 'class:update', 
  delete: 'class:delete',
  export: 'class:view',
  import: 'class:create'
}; 