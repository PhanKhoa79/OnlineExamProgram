import { DetailedInstruction } from '@/components/ui/TabbedHelpModal';

export const studentInstructions: DetailedInstruction[] = [
  {
    operation: 'create',
    title: 'Thêm sinh viên mới',
    description: 'Hướng dẫn chi tiết cách tạo hồ sơ sinh viên mới với tất cả thông tin cần thiết',
    permission: 'student:create',
    formFields: [
      {
        name: 'studentCode',
        label: 'Mã sinh viên',
        type: 'text',
        required: true,
        description: 'Mã định danh duy nhất của sinh viên trong hệ thống',
        placeholder: 'Student Code',
        validation: {
          field: 'studentCode',
          rules: [
            'Bắt buộc phải nhập',
            'Phải là duy nhất trong hệ thống',
            'Nên theo format chuẩn của trường (VD: SV2024001)'
          ],
          examples: ['SV2024001', 'DH21IT001', '2021CNTT001']
        }
      },
      {
        name: 'fullName',
        label: 'Họ và tên',
        type: 'text',
        required: true,
        description: 'Họ tên đầy đủ của sinh viên theo giấy tờ tùy thân',
        placeholder: 'Full Name',
        validation: {
          field: 'fullName',
          rules: [
            'Bắt buộc phải nhập',
            'Nhập đầy đủ họ và tên',
            'Viết hoa chữ cái đầu mỗi từ'
          ],
          examples: ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Nam']
        }
      },
      {
        name: 'gender',
        label: 'Giới tính',
        type: 'select',
        required: true,
        description: 'Giới tính của sinh viên',
        options: ['Nam', 'Nữ', 'Khác'],
        validation: {
          field: 'gender',
          rules: [
            'Bắt buộc phải chọn',
            'Chọn từ 3 tùy chọn: Nam, Nữ, Khác'
          ]
        }
      },
      {
        name: 'dateOfBirth',
        label: 'Ngày sinh',
        type: 'date',
        required: true,
        description: 'Ngày sinh của sinh viên theo định dạng DD/MM/YYYY',
        validation: {
          field: 'dateOfBirth',
          rules: [
            'Bắt buộc phải nhập',
            'Định dạng: DD/MM/YYYY',
            'Tuổi hợp lý (16-60 tuổi)'
          ],
          examples: ['15/08/2003', '22/12/2002', '03/05/2004']
        }
      },
      {
        name: 'phoneNumber',
        label: 'Số điện thoại',
        type: 'text',
        required: false,
        description: 'Số điện thoại liên lạc của sinh viên (tùy chọn)',
        validation: {
          field: 'phoneNumber',
          rules: [
            'Không bắt buộc',
            'Phải bắt đầu bằng số 0',
            'Chỉ chứa các chữ số',
            'Độ dài 10-11 chữ số'
          ],
          examples: ['0912345678', '0387654321', '0123456789']
        }
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: false,
        description: 'Địa chỉ email của sinh viên (tùy chọn)',
        validation: {
          field: 'email',
          rules: [
            'Không bắt buộc',
            'Phải có định dạng email hợp lệ',
            'Nên sử dụng email trường hoặc email cá nhân thường dùng'
          ],
          examples: ['sinhvien@university.edu.vn', 'nguyenvana@gmail.com', 'student@example.com']
        }
      },
      {
        name: 'address',
        label: 'Địa chỉ',
        type: 'textarea',
        required: false,
        description: 'Địa chỉ nơi ở hiện tại của sinh viên (tùy chọn)',
        validation: {
          field: 'address',
          rules: [
            'Không bắt buộc',
            'Nhập địa chỉ đầy đủ để dễ liên lạc',
            'Có thể để trống và cập nhật sau'
          ],
          examples: ['123 Đường ABC, Phường XYZ, Quận 1, TP.HCM', 'Số 45 Ngõ 67, Phố DEF, Hà Nội']
        }
      },
      {
        name: 'classId',
        label: 'Lớp học',
        type: 'select',
        required: true,
        description: 'Lớp học mà sinh viên thuộc về',
        validation: {
          field: 'classId',
          rules: [
            'Bắt buộc phải chọn',
            'Chọn từ danh sách lớp học có sẵn',
            'Có thể thay đổi sau nếu sinh viên chuyển lớp'
          ]
        }
      }
    ],
    steps: [
      'Nhấn vào nút "+ Thêm sinh viên" ở góc trên bên phải của trang danh sách',
      'Nhập mã sinh viên - đảm bảo mã chưa được sử dụng',
      'Nhập họ tên đầy đủ của sinh viên theo giấy tờ',
      'Chọn giới tính từ dropdown',
      'Nhập ngày sinh theo định dạng DD/MM/YYYY',
      'Tùy chọn: Nhập số điện thoại (phải đúng format)',
      'Tùy chọn: Nhập email của sinh viên',
      'Tùy chọn: Nhập địa chỉ nơi ở hiện tại',
      'Chọn lớp học từ danh sách dropdown',
      'Kiểm tra lại tất cả thông tin đã nhập',
      'Nhấn "Lưu" để tạo hồ sơ và chuyển sang trang chỉnh sửa',
      'Hoặc nhấn "Lưu & Thoát" để tạo hồ sơ và quay về danh sách'
    ],
    tips: [
      'Mã sinh viên nên theo quy định của trường để dễ quản lý',
      'Nhập đầy đủ thông tin liên lạc để dễ dàng thông báo',
      'Kiểm tra kỹ ngày sinh để tránh nhầm lẫn',
      'Có thể để trống email và SĐT, cập nhật sau khi có thông tin',
      'Chọn đúng lớp học để sinh viên nhận được thông báo phù hợp'
    ],
    warnings: [
      'Mã sinh viên phải duy nhất trong toàn hệ thống',
      'Họ tên phải chính xác theo giấy tờ để tránh sai sót',
      'Số điện thoại phải đúng format, nếu sai sẽ báo lỗi',
      'Email phải đúng định dạng để có thể gửi thông báo',
      'Chọn sai lớp học có thể ảnh hưởng đến việc phân công thi'
    ],
    additionalNotes: [
      'Hệ thống sẽ tự động gán ID cho sinh viên mới',
      'Thông tin có thể chỉnh sửa sau khi tạo hồ sơ',
      'Sinh viên mới sẽ xuất hiện trong danh sách ngay sau khi lưu',
      'Có thể import nhiều sinh viên cùng lúc bằng file Excel/CSV'
    ]
  },
  {
    operation: 'edit',
    title: 'Chỉnh sửa thông tin sinh viên',
    description: 'Hướng dẫn cách cập nhật thông tin hồ sơ sinh viên hiện có',
    permission: 'student:update',
    formFields: [
      {
        name: 'studentCode',
        label: 'Mã sinh viên',
        type: 'text',
        required: true,
        description: 'Mã sinh viên có thể chỉnh sửa nếu cần thiết',
        validation: {
          field: 'studentCode',
          rules: [
            'Bắt buộc phải nhập',
            'Phải duy nhất trong hệ thống',
            'Cẩn thận khi thay đổi vì ảnh hưởng đến dữ liệu liên quan'
          ]
        }
      },
      {
        name: 'fullName',
        label: 'Họ và tên',
        type: 'text',
        required: true,
        description: 'Cập nhật họ tên nếu có thay đổi chính thức',
        validation: {
          field: 'fullName',
          rules: [
            'Bắt buộc phải nhập',
            'Cập nhật theo giấy tờ mới nếu có thay đổi',
            'Đảm bảo chính xác để phục vụ in bằng'
          ]
        }
      },
      {
        name: 'gender',
        label: 'Giới tính',
        type: 'select',
        required: true,
        description: 'Cập nhật giới tính nếu cần thiết',
        options: ['Nam', 'Nữ', 'Khác']
      },
      {
        name: 'dateOfBirth',
        label: 'Ngày sinh',
        type: 'date',
        required: true,
        description: 'Chỉnh sửa ngày sinh nếu thông tin trước đó không chính xác',
        validation: {
          field: 'dateOfBirth',
          rules: [
            'Bắt buộc phải nhập',
            'Cẩn thận khi thay đổi vì ảnh hưởng đến độ tuổi',
            'Phải theo giấy tờ tùy thân'
          ]
        }
      },
      {
        name: 'phoneNumber',
        label: 'Số điện thoại',
        type: 'text',
        required: false,
        description: 'Cập nhật số điện thoại mới của sinh viên',
        validation: {
          field: 'phoneNumber',
          rules: [
            'Không bắt buộc',
            'Phải đúng format nếu nhập: 0xxxxxxxxx',
            'Có thể để trống nếu không có'
          ]
        }
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: false,
        description: 'Cập nhật địa chỉ email mới',
        validation: {
          field: 'email',
          rules: [
            'Không bắt buộc',
            'Phải đúng định dạng email',
            'Nên sử dụng email thường xuyên kiểm tra'
          ]
        }
      },
      {
        name: 'address',
        label: 'Địa chỉ',
        type: 'textarea',
        required: false,
        description: 'Cập nhật địa chỉ mới nếu sinh viên chuyển nơi ở'
      },
      {
        name: 'classId',
        label: 'Lớp học',
        type: 'select',
        required: true,
        description: 'Thay đổi lớp học nếu sinh viên chuyển lớp',
        validation: {
          field: 'classId',
          rules: [
            'Bắt buộc phải chọn',
            'Cẩn thận khi chuyển lớp vì ảnh hưởng đến kế hoạch học tập',
            'Đảm bảo lớp mới phù hợp với khóa học'
          ]
        }
      }
    ],
    steps: [
      'Tìm sinh viên cần chỉnh sửa trong bảng danh sách',
      'Nhấn vào biểu tượng bút chì (✏️) ở cột "Hành động"',
      'Trang chỉnh sửa sẽ mở với thông tin hiện tại được điền sẵn',
      'Xem lại thông tin hiện tại ở phần "Thông tin sinh viên hiện tại"',
      'Chỉnh sửa các trường cần cập nhật',
      'Kiểm tra validation realtime khi nhập liệu',
      'Xem lại summary ở cuối để đảm bảo thông tin đầy đủ',
      'Nhấn "Lưu" để cập nhật và ở lại trang chỉnh sửa',
      'Hoặc nhấn "Lưu & Thoát" để cập nhật và quay về danh sách'
    ],
    tips: [
      'Chỉ thay đổi những thông tin thực sự cần thiết',
      'Kiểm tra trạng thái "Đầy đủ thông tin" vs "Thiếu thông tin"',
      'Cập nhật email và SĐT để sinh viên nhận được thông báo',
      'Sử dụng "Lưu" nếu muốn tiếp tục chỉnh sửa nhiều mục',
      'Xem ngày tạo và cập nhật cuối để theo dõi lịch sử'
    ],
    warnings: [
      'Thay đổi mã sinh viên có thể ảnh hưởng đến dữ liệu liên quan',
      'Chuyển lớp sẽ ảnh hưởng đến kế hoạch học tập và thi cử',
      'Thay đổi ngày sinh cần cẩn thận vì ảnh hưởng đến độ tuổi',
      'Email và SĐT sai sẽ làm sinh viên bỏ lỡ thông báo quan trọng',
      'Chỉ admin hoặc giáo vụ mới có quyền chỉnh sửa thông tin sinh viên'
    ],
    additionalNotes: [
      'Thông tin cập nhật sẽ có hiệu lực ngay lập tức',
      'Hệ thống tự động ghi lại thời gian cập nhật cuối',
      'Có thể xem lịch sử thay đổi trong log hệ thống',
      'Badge trạng thái sẽ cập nhật tự động dựa trên thông tin'
    ]
  },
  {
    operation: 'delete',
    title: 'Xóa hồ sơ sinh viên',
    description: 'Hướng dẫn cách xóa hồ sơ sinh viên khỏi hệ thống',
    permission: 'student:delete',
    steps: [
      'Tìm sinh viên cần xóa trong bảng danh sách',
      'Nhấn vào biểu tượng thùng rác (🗑️) ở cột "Hành động"',
      'Hộp thoại xác nhận sẽ xuất hiện với thông tin sinh viên',
      'Đọc kỹ cảnh báo về hậu quả của việc xóa',
      'Nhấn "Xác nhận" để tiến hành xóa hồ sơ',
      'Hoặc nhấn "Hủy" để giữ lại hồ sơ sinh viên',
      'Hồ sơ sẽ bị xóa vĩnh viễn khỏi hệ thống'
    ],
    tips: [
      'Kiểm tra kỹ thông tin sinh viên trước khi xóa',
      'Cân nhắc việc chuyển sang trạng thái "inactive" thay vì xóa',
      'Backup dữ liệu quan trọng trước khi xóa',
      'Thông báo cho giáo viên liên quan về việc xóa sinh viên',
      'Kiểm tra xem sinh viên có đang tham gia kỳ thi nào không'
    ],
    warnings: [
      'THAO TÁC NÀY KHÔNG THỂ HOÀN TÁC!',
      'Tất cả dữ liệu liên quan đến sinh viên sẽ bị mất',
      'Điểm số và lịch sử thi cử sẽ bị xóa',
      'Thông tin tài khoản đăng nhập (nếu có) cũng sẽ bị xóa',
      'Chỉ admin hoặc trưởng khoa mới có quyền xóa sinh viên',
      'Việc xóa có thể ảnh hưởng đến báo cáo thống kê'
    ],
    additionalNotes: [
      'Xem xét sử dụng tính năng "chuyển trạng thái" thay vì xóa hẳn',
      'Một số dữ liệu thống kê có thể vẫn lưu lại ở dạng ẩn danh',
      'Liên hệ admin hệ thống nếu cần khôi phục dữ liệu',
      'Việc xóa sẽ được ghi log để kiểm tra sau này'
    ]
  }
];

// Permissions mapping for student feature
export const studentPermissions = {
  create: 'student:create',
  edit: 'student:update', 
  delete: 'student:delete',
  export: 'student:view',
  import: 'student:create'
}; 