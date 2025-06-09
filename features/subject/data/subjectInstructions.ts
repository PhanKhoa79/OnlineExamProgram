import { DetailedInstruction } from '@/components/ui/TabbedHelpModal';

export const subjectInstructions: DetailedInstruction[] = [
  {
    operation: 'create',
    title: 'Thêm môn học mới',
    description: 'Hướng dẫn chi tiết cách tạo môn học mới trong hệ thống',
    permission: 'subject:create',
    formFields: [
      {
        name: 'subjectCode',
        label: 'Mã môn học',
        type: 'text',
        required: true,
        description: 'Mã định danh duy nhất của môn học theo chuẩn trường',
        placeholder: 'Mã môn học',
        validation: {
          field: 'subjectCode',
          rules: [
            'Bắt buộc phải nhập',
            'Phải là duy nhất trong hệ thống',
            'Nên theo quy định mã môn của trường',
            'Không được chứa ký tự đặc biệt'
          ],
          examples: ['CNTT101', 'TOAN201', 'TIENG_ANH_1', 'VLDC101']
        }
      },
      {
        name: 'subjectName',
        label: 'Tên môn học',
        type: 'text',
        required: true,
        description: 'Tên đầy đủ của môn học theo chương trình đào tạo',
        placeholder: 'Tên môn học',
        validation: {
          field: 'subjectName',
          rules: [
            'Bắt buộc phải nhập',
            'Nhập tên đầy đủ và chính xác',
            'Viết hoa chữ cái đầu các từ chính',
            'Tránh viết tắt không rõ nghĩa'
          ],
          examples: ['Lập Trình Web', 'Toán Cao Cấp A1', 'Tiếng Anh Chuyên Ngành', 'Vật Lý Đại Cương']
        }
      },
      {
        name: 'subjectDescription',
        label: 'Mô tả môn học',
        type: 'textarea',
        required: false,
        description: 'Mô tả chi tiết về nội dung và mục tiêu của môn học (tùy chọn)',
        placeholder: 'Nhập mô tả cho môn học (tùy chọn)',
        validation: {
          field: 'subjectDescription',
          rules: [
            'Không bắt buộc',
            'Nên mô tả ngắn gọn về nội dung môn học',
            'Có thể bao gồm mục tiêu học tập',
            'Tối đa 500 ký tự để dễ đọc'
          ],
          examples: [
            'Môn học cung cấp kiến thức cơ bản về lập trình web với HTML, CSS và JavaScript',
            'Toán học cơ bản cho sinh viên năm nhất các ngành kỹ thuật',
            'Phát triển kỹ năng tiếng Anh chuyên ngành công nghệ thông tin'
          ]
        }
      }
    ],
    steps: [
      'Nhấn vào nút "+ Thêm Môn học" ở góc trên bên phải của trang danh sách',
      'Nhập mã môn học theo quy định của trường (bắt buộc)',
      'Nhập tên đầy đủ của môn học (bắt buộc)',
      'Tùy chọn: Nhập mô tả chi tiết về môn học để dễ hiểu',
      'Kiểm tra lại tất cả thông tin đã nhập',
      'Nhấn "Lưu" để tạo môn học và chuyển sang trang chỉnh sửa',
      'Hoặc nhấn "Lưu & Thoát" để tạo môn học và quay về danh sách'
    ],
    tips: [
      'Mã môn học nên theo chuẩn của trường để dễ quản lý',
      'Tên môn học phải chính xác theo chương trình đào tạo',
      'Mô tả giúp giáo viên và sinh viên hiểu rõ hơn về môn học',
      'Có thể để trống mô tả và cập nhật sau khi có thông tin đầy đủ',
      'Kiểm tra không trùng lặp với các môn học đã có'
    ],
    warnings: [
      'Mã môn học phải duy nhất trong toàn hệ thống',
      'Tên môn học phải chính xác theo tài liệu chính thức',
      'Không thể thay đổi mã môn sau khi đã có sinh viên đăng ký',
      'Mô tả không nên quá dài để tránh khó đọc',
      'Chỉ admin hoặc phòng đào tạo mới có quyền tạo môn học'
    ],
    additionalNotes: [
      'Hệ thống sẽ tự động gán ID cho môn học mới',
      'Môn học mới sẽ xuất hiện trong danh sách ngay sau khi lưu',
      'Có thể chỉnh sửa thông tin môn học sau khi tạo',
      'Môn học cần được gán cho giáo viên trước khi mở lớp'
    ]
  },
  {
    operation: 'edit',
    title: 'Chỉnh sửa thông tin môn học',
    description: 'Hướng dẫn cách cập nhật thông tin môn học hiện có',
    permission: 'subject:update',
    formFields: [
      {
        name: 'subjectCode',
        label: 'Mã môn học',
        type: 'text',
        required: true,
        description: 'Cập nhật mã môn học nếu cần thiết',
        validation: {
          field: 'subjectCode',
          rules: [
            'Bắt buộc phải nhập',
            'Phải duy nhất trong hệ thống',
            'Cẩn thận khi thay đổi vì ảnh hưởng đến dữ liệu liên quan',
            'Nên giữ nguyên nếu đã có sinh viên đăng ký'
          ]
        }
      },
      {
        name: 'subjectName',
        label: 'Tên môn học',
        type: 'text',
        required: true,
        description: 'Cập nhật tên môn học theo tài liệu mới nhất',
        validation: {
          field: 'subjectName',
          rules: [
            'Bắt buộc phải nhập',
            'Cập nhật theo tài liệu chính thức mới nhất',
            'Đảm bảo chính xác để phục vụ in bằng',
            'Thông báo cho giáo viên khi có thay đổi'
          ]
        }
      },
      {
        name: 'subjectDescription',
        label: 'Mô tả môn học',
        type: 'textarea',
        required: false,
        description: 'Cập nhật hoặc bổ sung mô tả môn học',
        validation: {
          field: 'subjectDescription',
          rules: [
            'Không bắt buộc',
            'Cập nhật theo chương trình mới',
            'Có thể bổ sung thông tin về phương pháp học',
            'Nên giữ mô tả ngắn gọn và dễ hiểu'
          ]
        }
      }
    ],
    steps: [
      'Tìm môn học cần chỉnh sửa trong bảng danh sách',
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
      'Cập nhật mô tả để giúp sinh viên hiểu rõ hơn về môn học',
      'Kiểm tra ngày tạo và cập nhật để theo dõi lịch sử',
      'Sử dụng "Lưu" nếu muốn tiếp tục chỉnh sửa nhiều mục',
      'Thông báo cho giáo viên liên quan khi có thay đổi quan trọng'
    ],
    warnings: [
      'Thay đổi mã môn học có thể ảnh hưởng đến dữ liệu liên quan',
      'Cập nhật tên môn học cần thông báo cho các bên liên quan',
      'Chỉ admin hoặc phòng đào tạo mới có quyền chỉnh sửa',
      'Thay đổi mô tả có thể ảnh hưởng đến kế hoạch giảng dạy',
      'Kiểm tra không trùng lặp mã môn với môn học khác'
    ],
    additionalNotes: [
      'Thông tin cập nhật sẽ có hiệu lực ngay lập tức',
      'Hệ thống tự động ghi lại thời gian cập nhật cuối',
      'Có thể xem lịch sử thay đổi trong log hệ thống',
      'Thông tin sẽ được đồng bộ với các module khác'
    ]
  },
  {
    operation: 'delete',
    title: 'Xóa môn học',
    description: 'Hướng dẫn cách xóa môn học khỏi hệ thống',
    permission: 'subject:delete',
    steps: [
      'Tìm môn học cần xóa trong bảng danh sách',
      'Nhấn vào biểu tượng thùng rác (🗑️) ở cột "Hành động"',
      'Hộp thoại xác nhận sẽ xuất hiện với thông tin môn học',
      'Đọc kỹ cảnh báo về hậu quả của việc xóa',
      'Nhấn "Xác nhận" để tiến hành xóa môn học',
      'Hoặc nhấn "Hủy" để giữ lại môn học',
      'Môn học sẽ bị xóa vĩnh viễn khỏi hệ thống'
    ],
    tips: [
      'Kiểm tra kỹ thông tin môn học trước khi xóa',
      'Đảm bảo không còn sinh viên nào đăng ký môn học này',
      'Backup dữ liệu quan trọng trước khi xóa',
      'Thông báo cho giáo viên liên quan về việc xóa môn học',
      'Kiểm tra lịch thi và kế hoạch giảng dạy liên quan'
    ],
    warnings: [
      'THAO TÁC NÀY KHÔNG THỂ HOÀN TÁC!',
      'Tất cả dữ liệu liên quan đến môn học sẽ bị mất',
      'Lịch thi và kết quả thi của môn học sẽ bị xóa',
      'Thông tin phân công giảng dạy sẽ bị mất',
      'Chỉ admin hoặc trưởng khoa mới có quyền xóa môn học',
      'Việc xóa có thể ảnh hưởng đến chương trình đào tạo'
    ],
    additionalNotes: [
      'Xem xét sử dụng tính năng "ẩn môn học" thay vì xóa hẳn',
      'Một số dữ liệu thống kê có thể vẫn lưu lại ở dạng ẩn danh',
      'Liên hệ admin hệ thống nếu cần khôi phục dữ liệu',
      'Việc xóa sẽ được ghi log để kiểm tra sau này'
    ]
  }
];

// Permissions mapping for subject feature
export const subjectPermissions = {
  create: 'subject:create',
  edit: 'subject:update', 
  delete: 'subject:delete',
  export: 'subject:view',
  import: 'subject:create'
}; 