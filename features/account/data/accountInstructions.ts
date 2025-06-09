import { DetailedInstruction } from '@/components/ui/TabbedHelpModal';

export const accountInstructions: DetailedInstruction[] = [
  {
    operation: 'create',
    title: 'Thêm tài khoản mới',
    description: 'Hướng dẫn chi tiết cách tạo tài khoản mới với tất cả các trường bắt buộc và validation',
    permission: 'account:create',
    formFields: [
      {
        name: 'accountname',
        label: 'Tên tài khoản',
        type: 'text',
        required: true,
        description: 'Tên đăng nhập duy nhất của người dùng, không thể thay đổi sau khi tạo',
        placeholder: 'Username',
        validation: {
          field: 'accountname',
          rules: [
            'Bắt buộc phải nhập',
            'Độ dài từ 3-20 ký tự',
            'Chỉ được chứa chữ cái, số và dấu gạch dưới',
            'Không được chứa khoảng trắng',
            'Phải là duy nhất trong hệ thống'
          ],
          examples: ['user123', 'john_doe', 'admin2024']
        }
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        description: 'Địa chỉ email để liên lạc và đăng nhập',
        placeholder: 'Email',
        validation: {
          field: 'email',
          rules: [
            'Bắt buộc phải nhập',
            'Phải có định dạng email hợp lệ',
            'Phải là duy nhất trong hệ thống',
            'Độ dài tối đa 255 ký tự'
          ],
          examples: ['user@example.com', 'john.doe@company.vn', 'admin@school.edu.vn']
        }
      },
      {
        name: 'password',
        label: 'Mật khẩu',
        type: 'password',
        required: true,
        description: 'Mật khẩu đăng nhập với độ bảo mật cao',
        placeholder: 'Password',
        validation: {
          field: 'password',
          rules: [
            'Bắt buộc phải nhập',
            'Độ dài tối thiểu 8 ký tự',
            'Nên chứa chữ hoa, chữ thường, số và ký tự đặc biệt',
            'Không được chứa khoảng trắng'
          ],
          examples: ['MyPass123!', 'SecureP@ss2024', 'StrongPwd#456']
        }
      },
      {
        name: 'role',
        label: 'Vai trò',
        type: 'select',
        required: true,
        description: 'Quyền hạn và chức năng mà tài khoản có thể sử dụng',
        options: ['Admin', 'Teacher', 'Student', 'Manager'],
        validation: {
          field: 'role',
          rules: [
            'Bắt buộc phải chọn',
            'Phải chọn từ danh sách có sẵn'
          ]
        }
      },
      {
        name: 'isActive',
        label: 'Trạng thái',
        type: 'radio',
        required: true,
        description: 'Quyết định tài khoản có thể đăng nhập hay không',
        options: ['Kích hoạt', 'Chưa kích hoạt'],
        validation: {
          field: 'isActive',
          rules: [
            'Bắt buộc phải chọn',
            'Mặc định nên chọn "Kích hoạt" cho tài khoản mới'
          ]
        }
      },
      {
        name: 'urlAvatar',
        label: 'Ảnh đại diện',
        type: 'file',
        required: false,
        description: 'Ảnh đại diện của người dùng (tùy chọn)',
        validation: {
          field: 'urlAvatar',
          rules: [
            'Không bắt buộc',
            'Chỉ chấp nhận file ảnh (JPG, PNG, GIF)',
            'Kích thước tối đa 5MB',
            'Nếu không chọn sẽ sử dụng ảnh mặc định'
          ]
        }
      }
    ],
    steps: [
      'Nhấn vào nút "+ Thêm Tài khoản" ở góc trên bên phải của trang danh sách',
      'Nhập tên tài khoản (username) - lưu ý không thể thay đổi sau này',
      'Nhập địa chỉ email hợp lệ và chưa được sử dụng',
      'Nhập mật khẩu mạnh có ít nhất 8 ký tự',
      'Chọn vai trò phù hợp từ dropdown',
      'Chọn trạng thái "Kích hoạt" hoặc "Chưa kích hoạt"',
      'Tùy chọn: Upload ảnh đại diện bằng cách nhấn "Chọn file"',
      'Kiểm tra lại tất cả thông tin đã nhập',
      'Nhấn "Lưu" để tạo tài khoản và chuyển sang trang chỉnh sửa',
      'Hoặc nhấn "Lưu & Thoát" để tạo tài khoản và quay về danh sách'
    ],
    tips: [
      'Chọn tên tài khoản dễ nhớ và phù hợp với người dùng',
      'Sử dụng email chính thức của tổ chức nếu có',
      'Tạo mật khẩu mạnh và ghi nhớ để đưa cho người dùng',
      'Chọn vai trò phù hợp với công việc của người dùng',
      'Nên kích hoạt tài khoản ngay nếu người dùng sẵn sàng sử dụng'
    ],
    warnings: [
      'Tên tài khoản KHÔNG THỂ thay đổi sau khi tạo',
      'Email phải duy nhất, không được trùng với tài khoản khác',
      'Mật khẩu sẽ được mã hóa và không thể xem lại',
      'Vai trò quyết định quyền hạn, chọn cẩn thận',
      'Tài khoản chưa kích hoạt không thể đăng nhập'
    ],
    additionalNotes: [
      'Hệ thống sẽ tự động gửi email thông báo đến địa chỉ email đã nhập',
      'Ảnh đại diện có thể thay đổi sau này trong phần chỉnh sửa',
      'Có thể tạo nhiều tài khoản liên tiếp bằng cách nhấn "Lưu" thay vì "Lưu & Thoát"'
    ]
  },
  {
    operation: 'edit',
    title: 'Chỉnh sửa tài khoản',
    description: 'Hướng dẫn cách cập nhật thông tin tài khoản hiện có',
    permission: 'account:update',
    formFields: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        description: 'Email hiện tại (không thể chỉnh sửa)',
        validation: {
          field: 'email',
          rules: [
            'Trường này bị khóa và không thể chỉnh sửa',
            'Chỉ hiển thị để tham khảo'
          ]
        }
      },
      {
        name: 'accountname',
        label: 'Tên tài khoản',
        type: 'text',
        required: true,
        description: 'Tên đăng nhập có thể chỉnh sửa',
        validation: {
          field: 'accountname',
          rules: [
            'Bắt buộc phải nhập',
            'Độ dài từ 3-20 ký tự',
            'Chỉ được chứa chữ cái, số và dấu gạch dưới',
            'Không được chứa khoảng trắng'
          ],
          examples: ['user123_updated', 'john_doe_new', 'admin2024_v2']
        }
      },
      {
        name: 'password',
        label: 'Mật khẩu mới',
        type: 'password',
        required: false,
        description: 'Để trống nếu không muốn thay đổi mật khẩu',
        placeholder: 'Để trống để giữ mật khẩu hiện tại',
        validation: {
          field: 'password',
          rules: [
            'Không bắt buộc - để trống để giữ mật khẩu cũ',
            'Nếu nhập: tối thiểu 8 ký tự',
            'Nên chứa chữ hoa, chữ thường, số và ký tự đặc biệt'
          ]
        }
      },
      {
        name: 'role',
        label: 'Vai trò',
        type: 'select',
        required: true,
        description: 'Cập nhật quyền hạn của tài khoản',
        options: ['Admin', 'Teacher', 'Student', 'Manager'],
        validation: {
          field: 'role',
          rules: [
            'Bắt buộc phải chọn',
            'Thay đổi vai trò sẽ ảnh hưởng đến quyền hạn'
          ]
        }
      },
      {
        name: 'isActive',
        label: 'Trạng thái',
        type: 'radio',
        required: true,
        description: 'Kích hoạt hoặc vô hiệu hóa tài khoản',
        options: ['Đã kích hoạt', 'Chưa kích hoạt'],
        validation: {
          field: 'isActive',
          rules: [
            'Bắt buộc phải chọn',
            'Vô hiệu hóa sẽ ngăn người dùng đăng nhập'
          ]
        }
      },
      {
        name: 'urlAvatar',
        label: 'Ảnh đại diện',
        type: 'file',
        required: false,
        description: 'Cập nhật ảnh đại diện mới',
        validation: {
          field: 'urlAvatar',
          rules: [
            'Không bắt buộc',
            'Upload ảnh mới để thay thế ảnh hiện tại',
            'Chỉ chấp nhận file ảnh (JPG, PNG, GIF)',
            'Kích thước tối đa 5MB'
          ]
        }
      }
    ],
    steps: [
      'Tìm tài khoản cần chỉnh sửa trong bảng danh sách',
      'Nhấn vào biểu tượng bút chì (✏️) ở cột "Hành động"',
      'Trang chỉnh sửa sẽ mở với thông tin hiện tại được điền sẵn',
      'Chỉnh sửa tên tài khoản nếu cần (email không thể sửa)',
      'Nhập mật khẩu mới nếu muốn thay đổi, hoặc để trống',
      'Cập nhật vai trò nếu cần thay đổi quyền hạn',
      'Thay đổi trạng thái kích hoạt nếu cần',
      'Upload ảnh đại diện mới nếu muốn thay thế',
      'Xem lại thông tin chi tiết ở cuối trang',
      'Nhấn "Lưu" để cập nhật và ở lại trang chỉnh sửa',
      'Hoặc nhấn "Lưu & Thoát" để cập nhật và quay về danh sách'
    ],
    tips: [
      'Chỉ thay đổi những thông tin thực sự cần thiết',
      'Để trống mật khẩu nếu không muốn thay đổi',
      'Kiểm tra vai trò mới có phù hợp với công việc không',
      'Xem thông tin chi tiết để đảm bảo cập nhật đúng',
      'Sử dụng "Lưu" nếu muốn tiếp tục chỉnh sửa'
    ],
    warnings: [
      'Email KHÔNG THỂ thay đổi trong trang này',
      'Thay đổi vai trò sẽ thay đổi quyền hạn của người dùng',
      'Vô hiệu hóa tài khoản sẽ ngăn người dùng đăng nhập',
      'Thay đổi mật khẩu sẽ buộc người dùng đăng nhập lại',
      'Chỉ admin mới có thể thay đổi vai trò của tài khoản khác'
    ],
    additionalNotes: [
      'Thông tin cập nhật sẽ có hiệu lực ngay lập tức',
      'Hệ thống sẽ ghi lại thời gian cập nhật cuối cùng',
      'Nếu thay đổi vai trò, người dùng cần đăng nhập lại để có quyền mới'
    ]
  },
  {
    operation: 'delete',
    title: 'Xóa tài khoản',
    description: 'Hướng dẫn cách xóa tài khoản khỏi hệ thống',
    permission: 'account:delete',
    steps: [
      'Tìm tài khoản cần xóa trong bảng danh sách',
      'Nhấn vào biểu tượng thùng rác (🗑️) ở cột "Hành động"',
      'Hộp thoại xác nhận sẽ xuất hiện',
      'Đọc kỹ thông báo cảnh báo về việc xóa',
      'Nhấn "Xác nhận" để tiến hành xóa',
      'Hoặc nhấn "Hủy" để giữ lại tài khoản',
      'Tài khoản sẽ bị xóa vĩnh viễn khỏi hệ thống'
    ],
    tips: [
      'Kiểm tra kỹ thông tin tài khoản trước khi xóa',
      'Cân nhắc vô hiệu hóa thay vì xóa nếu có thể',
      'Backup dữ liệu quan trọng trước khi xóa',
      'Thông báo cho người dùng trước khi xóa tài khoản'
    ],
    warnings: [
      'THAO TÁC NÀY KHÔNG THỂ HOÀN TÁC!',
      'Tất cả dữ liệu liên quan đến tài khoản sẽ bị mất',
      'Lịch sử đăng nhập sẽ bị xóa',
      'Nếu tài khoản đang đăng nhập, sẽ bị logout ngay lập tức',
      'Chỉ admin mới có quyền xóa tài khoản'
    ],
    additionalNotes: [
      'Xem xét sử dụng tính năng "Vô hiệu hóa" thay vì xóa',
      'Một số dữ liệu liên quan có thể vẫn tồn tại trong hệ thống',
      'Liên hệ admin hệ thống nếu cần khôi phục dữ liệu'
    ]
  }
];

// Permissions mapping for account feature
export const accountPermissions = {
  create: 'account:create',
  edit: 'account:update', 
  delete: 'account:delete',
  export: 'account:view',
  import: 'account:create'
}; 