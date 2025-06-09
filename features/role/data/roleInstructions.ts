import { DetailedInstruction } from '@/components/ui/TabbedHelpModal';

export const roleInstructions: DetailedInstruction[] = [
  {
    operation: 'create',
    title: 'Thêm vai trò mới',
    description: 'Hướng dẫn chi tiết cách tạo vai trò mới với phân quyền cụ thể',
    permission: 'role:create',
    formFields: [
      {
        name: 'roleName',
        label: 'Tên vai trò',
        type: 'text',
        required: true,
        description: 'Tên vai trò mô tả chức năng và quyền hạn trong hệ thống',
        placeholder: 'Role',
        validation: {
          field: 'roleName',
          rules: [
            'Bắt buộc phải nhập',
            'Phải là duy nhất trong hệ thống',
            'Nên sử dụng tên mô tả rõ chức năng',
            'Tránh sử dụng ký tự đặc biệt'
          ],
          examples: ['Admin', 'Giáo Viên', 'Sinh Viên', 'Quản Trị Viên', 'Giám Đốc']
        }
      },
      {
        name: 'permissions',
        label: 'Danh sách quyền',
        type: 'treeview',
        required: true,
        description: 'Chọn các quyền cụ thể mà vai trò này được phép thực hiện',
        validation: {
          field: 'permissions',
          rules: [
            'Bắt buộc phải chọn ít nhất một quyền',
            'Quyền được tổ chức theo cấu trúc cây phân cấp',
            'Có thể chọn nhiều quyền cùng lúc',
            'Nên chọn quyền phù hợp với vai trò'
          ],
          examples: [
            'account:view - Xem danh sách tài khoản',
            'student:create - Tạo sinh viên mới',
            'exam:update - Chỉnh sửa kỳ thi',
            'role:delete - Xóa vai trò'
          ]
        }
      }
    ],
    steps: [
      'Nhấn vào nút "+ Thêm vai trò" ở góc trên bên phải của trang danh sách',
      'Nhập tên vai trò mô tả rõ chức năng và quyền hạn',
      'Mở cây phân quyền để xem tất cả quyền có sẵn',
      'Chọn các quyền phù hợp với vai trò này',
      'Có thể chọn toàn bộ nhóm quyền hoặc chọn từng quyền cụ thể',
      'Kiểm tra lại danh sách quyền đã chọn',
      'Nhấn "Lưu" để tạo vai trò và chuyển sang trang chỉnh sửa',
      'Hoặc nhấn "Lưu & Thoát" để tạo vai trò và quay về danh sách'
    ],
    tips: [
      'Tên vai trò nên ngắn gọn và dễ hiểu',
      'Chọn quyền theo nguyên tắc "quyền tối thiểu cần thiết"',
      'Có thể mở rộng/thu gọn các nhóm quyền trong cây',
      'Sử dụng thanh tìm kiếm để tìm quyền cụ thể',
      'Nên tạo vai trò theo từng chức năng cụ thể'
    ],
    warnings: [
      'Tên vai trò phải duy nhất trong toàn hệ thống',
      'Phải chọn ít nhất một quyền để tạo vai trò',
      'Cấp quyền quá cao có thể gây rủi ro bảo mật',
      'Chỉ admin cấp cao mới có quyền tạo vai trò',
      'Vai trò một khi tạo sẽ ảnh hưởng đến tất cả user được gán'
    ],
    additionalNotes: [
      'Hệ thống sẽ tự động gán ID cho vai trò mới',
      'Vai trò mới sẽ xuất hiện trong danh sách ngay sau khi lưu',
      'Có thể chỉnh sửa quyền sau khi tạo vai trò',
      'Cần gán vai trò cho user để có hiệu lực'
    ]
  },
  {
    operation: 'edit',
    title: 'Chỉnh sửa vai trò',
    description: 'Hướng dẫn cách cập nhật quyền hạn cho vai trò hiện có',
    permission: 'role:update',
    formFields: [
      {
        name: 'roleName',
        label: 'Tên vai trò',
        type: 'text',
        required: true,
        description: 'Tên vai trò hiện tại (chỉ đọc, không thể chỉnh sửa)',
        validation: {
          field: 'roleName',
          rules: [
            'Không thể chỉnh sửa tên vai trò',
            'Tên hiển thị để xác nhận đang chỉnh sửa đúng vai trò',
            'Liên hệ admin nếu cần đổi tên vai trò'
          ]
        }
      },
      {
        name: 'permissions',
        label: 'Danh sách quyền',
        type: 'treeview',
        required: true,
        description: 'Cập nhật các quyền cho vai trò này',
        validation: {
          field: 'permissions',
          rules: [
            'Bắt buộc phải chọn ít nhất một quyền',
            'Có thể thêm hoặc bỏ quyền hiện có',
            'Quyền mới sẽ có hiệu lực ngay lập tức',
            'Cẩn thận khi thu hồi quyền quan trọng'
          ]
        }
      }
    ],
    steps: [
      'Tìm vai trò cần chỉnh sửa trong bảng danh sách',
      'Nhấn vào biểu tượng bút chì (✏️) ở cột "Hành động"',
      'Trang chỉnh sửa sẽ mở với quyền hiện tại được chọn sẵn',
      'Xem lại thông tin chi tiết vai trò ở phần cuối',
      'Mở cây phân quyền để xem tất cả quyền',
      'Thêm quyền mới bằng cách tick vào checkbox',
      'Bỏ quyền hiện có bằng cách untick checkbox',
      'Kiểm tra lại danh sách quyền sau khi thay đổi',
      'Nhấn "Lưu" để cập nhật và ở lại trang chỉnh sửa',
      'Hoặc nhấn "Lưu & Thoát" để cập nhật và quay về danh sách'
    ],
    tips: [
      'Xem kỹ quyền hiện tại trước khi thay đổi',
      'Kiểm tra số lượng quyền sau khi cập nhật',
      'Thử nghiệm quyền mới với tài khoản test',
      'Sử dụng "Lưu" nếu muốn tiếp tục chỉnh sửa',
      'Thông báo cho user khi thay đổi quyền quan trọng'
    ],
    warnings: [
      'Thay đổi quyền sẽ ảnh hưởng đến tất cả user có vai trò này',
      'Thu hồi quyền có thể làm user không truy cập được chức năng',
      'Cấp thêm quyền cao có thể gây rủi ro bảo mật',
      'Chỉ admin cấp cao mới có quyền chỉnh sửa vai trô',
      'Một số quyền hệ thống không nên thay đổi'
    ],
    additionalNotes: [
      'Thay đổi có hiệu lực ngay lập tức với tất cả user',
      'Hệ thống tự động ghi lại thời gian cập nhật',
      'Có thể xem lịch sử thay đổi quyền trong log',
      'User cần đăng nhập lại để quyền mới có hiệu lực'
    ]
  },
  {
    operation: 'delete',
    title: 'Xóa vai trò',
    description: 'Hướng dẫn cách xóa vai trò khỏi hệ thống',
    permission: 'role:delete',
    steps: [
      'Tìm vai trò cần xóa trong bảng danh sách',
      'Nhấn vào biểu tượng thùng rác (🗑️) ở cột "Hành động"',
      'Hộp thoại xác nhận sẽ xuất hiện với thông tin vai trò',
      'Đọc kỹ cảnh báo về hậu quả của việc xóa',
      'Nhấn "Xác nhận" để tiến hành xóa vai trò',
      'Hoặc nhấn "Hủy" để giữ lại vai trò',
      'Vai trò sẽ bị xóa vĩnh viễn khỏi hệ thống'
    ],
    tips: [
      'Kiểm tra kỹ thông tin vai trò trước khi xóa',
      'Đảm bảo không còn user nào được gán vai trò này',
      'Backup dữ liệu quan trọng trước khi xóa',
      'Xem xét chuyển user sang vai trò khác trước',
      'Kiểm tra các quyền quan trọng trong vai trò'
    ],
    warnings: [
      'THAO TÁC NÀY KHÔNG THỂ HOÀN TÁC!',
      'Tất cả user có vai trò này sẽ mất quyền truy cập',
      'Phân quyền và cấu hình liên quan sẽ bị mất',
      'Không thể xóa vai trò hệ thống mặc định',
      'Chỉ super admin mới có quyền xóa vai trò',
      'Việc xóa có thể làm hệ thống mất ổn định'
    ],
    additionalNotes: [
      'Xem xét vô hiệu hóa thay vì xóa hoàn toàn',
      'Một số dữ liệu log có thể vẫn tham chiếu đến vai trò',
      'Liên hệ admin hệ thống nếu cần khôi phục',
      'Việc xóa sẽ được ghi log để kiểm tra sau này'
    ]
  }
];


export const rolePermissions = {
  create: 'role:create',
  edit: 'role:update', 
  delete: 'role:delete',
}; 