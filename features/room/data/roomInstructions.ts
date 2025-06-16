import { DetailedInstruction } from '@/components/ui/TabbedHelpModal';

export const roomInstructions: DetailedInstruction[] = [
  {
    operation: 'create',
    title: 'Thêm phòng thi mới',
    description: 'Hướng dẫn chi tiết cách tạo phòng thi mới với tất cả các trường bắt buộc và validation',
    permission: 'room:create',
    formFields: [
      {
        name: 'code',
        label: 'Mã phòng thi',
        type: 'text',
        required: true,
        description: 'Mã định danh duy nhất cho phòng thi',
        placeholder: 'Nhập mã phòng thi',
        validation: {
          field: 'code',
          rules: [
            'Bắt buộc phải nhập',
            'Phải là duy nhất trong hệ thống',
            'Nên sử dụng quy tắc đặt tên rõ ràng'
          ],
          examples: ['MPTH_001', 'ROOM_TOAN_A1', 'PHONG_THI_01']
        }
      },
      {
        name: 'examId',
        label: 'Bài thi',
        type: 'select',
        required: true,
        description: 'Chọn bài thi cho phòng thi',
        placeholder: 'Chọn bài thi',
        validation: {
          field: 'examId',
          rules: [
            'Bắt buộc phải chọn',
            'Chỉ có thể chọn một bài thi',
            'Có thể lọc theo môn học để dễ tìm'
          ],
          examples: ['Đề thi giữa kỳ - Toán học', 'Kiểm tra 15 phút - Tiếng Anh', 'Thi thử THPT - Vật lý']
        }
      },
      {
        name: 'examScheduleId',
        label: 'Lịch thi',
        type: 'select',
        required: true,
        description: 'Chọn lịch thi cho phòng thi',
        placeholder: 'Chọn lịch thi',
        validation: {
          field: 'examScheduleId',
          rules: [
            'Bắt buộc phải chọn',
            'Chỉ hiển thị lịch thi đang hoạt động',
            'Phòng thi sẽ tự động mở/đóng theo lịch'
          ],
          examples: ['LT_TOAN_2024', 'SCHEDULE_001', 'FINAL_ENG_SEM1']
        }
      },
      {
        name: 'classId',
        label: 'Lớp học',
        type: 'select',
        required: true,
        description: 'Chọn lớp học tham gia thi',
        placeholder: 'Chọn lớp học',
        validation: {
          field: 'classId',
          rules: [
            'Bắt buộc phải chọn',
            'Chỉ có thể chọn một lớp học',
            'Học sinh trong lớp sẽ có quyền vào phòng thi'
          ],
          examples: ['12A1', 'CNTT01', 'TOAN_CAO_CAP']
        }
      },
      {
        name: 'maxParticipants',
        label: 'Số người tham gia tối đa',
        type: 'number',
        required: false,
        description: 'Giới hạn số lượng học sinh có thể tham gia (mặc định: 30)',
        placeholder: 'Nhập số người tối đa',
        validation: {
          field: 'maxParticipants',
          rules: [
            'Không bắt buộc (mặc định: 30)',
            'Phải là số nguyên dương',
            'Nên phù hợp với sĩ số lớp học'
          ],
          examples: ['30', '25', '40', '50']
        }
      },
      {
        name: 'randomizeOrder',
        label: 'Trộn thứ tự câu hỏi',
        type: 'radio',
        required: false,
        description: 'Bật/tắt tính năng trộn thứ tự câu hỏi cho mỗi học sinh',
        options: ['Bật', 'Tắt'],
        validation: {
          field: 'randomizeOrder',
          rules: [
            'Không bắt buộc (mặc định: tắt)',
            'Giúp tăng tính công bằng trong thi',
            'Mỗi học sinh sẽ có thứ tự câu hỏi khác nhau'
          ]
        }
      },
      {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        required: false,
        description: 'Trạng thái hiện tại của phòng thi (mặc định: Chờ mở)',
        placeholder: 'Chọn trạng thái',
        options: ['Chờ mở', 'Đang mở', 'Đã đóng'],
        validation: {
          field: 'status',
          rules: [
            'Không bắt buộc (mặc định: Chờ mở)',
            'Phòng thi sẽ tự động mở theo lịch',
            'Có thể thay đổi thủ công nếu cần'
          ]
        }
      },
      {
        name: 'description',
        label: 'Mô tả',
        type: 'textarea',
        required: false,
        description: 'Thông tin bổ sung về phòng thi',
        placeholder: 'Nhập mô tả cho phòng thi (tùy chọn)',
        validation: {
          field: 'description',
          rules: [
            'Không bắt buộc',
            'Có thể nhập nhiều dòng',
            'Nên mô tả rõ ràng về phòng thi'
          ],
          examples: [
            'Phòng thi dành cho lớp 12A1 - Kỳ thi cuối học kỳ',
            'Thi thử THPT Quốc gia - Môn Toán',
            'Kiểm tra 15 phút - Chương 1 Đại số'
          ]
        }
      }
    ],
    steps: [
      'Nhấn vào nút "+ Thêm phòng thi" ở góc trên bên phải của trang danh sách',
      'Nhập mã phòng thi duy nhất và dễ nhận biết',
      'Sử dụng bộ lọc môn học để tìm bài thi phù hợp',
      'Chọn bài thi từ dropdown (có thể lọc theo môn)',
      'Chọn lịch thi đang hoạt động',
      'Chọn lớp học sẽ tham gia thi',
      'Đặt số người tham gia tối đa (nếu cần)',
      'Bật tính năng trộn câu hỏi nếu muốn tăng tính công bằng',
      'Thêm mô tả nếu cần thiết',
      'Kiểm tra lại thông tin trước khi lưu',
      'Nhấn "Lưu và thoát" để tạo và quay về danh sách'
    ],
    tips: [
      'Hệ thống sẽ tự động tạo mã phòng thi khi chọn đủ bài thi, lịch thi và lớp học',
      'Sử dụng bộ lọc môn học để dễ dàng tìm bài thi phù hợp',
      'Số người tham gia tối đa nên phù hợp với sĩ số lớp học',
      'Tính năng trộn câu hỏi giúp tăng tính công bằng trong thi',
      'Phòng thi sẽ tự động mở/đóng theo thời gian trong lịch thi'
    ],
    warnings: [
      'Mã phòng thi phải là duy nhất trong hệ thống',
      'Phải chọn đủ bài thi, lịch thi và lớp học',
      'Lưu ý kiểm tra kỹ thông tin trước khi lưu'
    ]
  },
  {
    operation: 'edit',
    title: 'Chỉnh sửa phòng thi',
    description: 'Hướng dẫn cách cập nhật thông tin phòng thi hiện có',
    permission: 'room:update',
    steps: [
      'Tìm phòng thi cần chỉnh sửa trong bảng danh sách',
      'Nhấn vào biểu tượng bút chì (✏️) ở cột "Hành động"',
      'Cập nhật thông tin cần thiết trong form',
      'Lưu ý: Không thể thay đổi lịch thi',
      'Kiểm tra lại thông tin trước khi lưu',
      'Nhấn "Lưu và thoát" để cập nhật và quay về danh sách'
    ],
    tips: [
      'Chỉ có thể chỉnh sửa phòng thi có trạng thái "Chờ mở"',
      'Không thể thay đổi lịch thi sau khi tạo phòng',
      'Nên cân nhắc kỹ trước khi thay đổi bài thi hoặc lớp học'
    ],
    warnings: [
      'Không thể chỉnh sửa phòng thi đã đóng hoặc đang mở',
      'Thay đổi lớp học sẽ ảnh hưởng đến quyền truy cập của học sinh'
    ]
  },
  {
    operation: 'delete',
    title: 'Xóa phòng thi',
    description: 'Hướng dẫn cách xóa phòng thi khỏi hệ thống',
    permission: 'room:delete',
    steps: [
      'Tìm phòng thi cần xóa trong bảng danh sách',
      'Nhấn vào biểu tượng thùng rác (🗑️) ở cột "Hành động"',
      'Đọc kỹ thông báo xác nhận trong hộp thoại',
      'Nhấn "Xác nhận xóa" để hoàn tất việc xóa',
      'Phòng thi sẽ bị xóa vĩnh viễn khỏi hệ thống'
    ],
    warnings: [
      '⚠️ Thao tác xóa không thể hoàn tác!',
      'Không thể xóa phòng thi đã có học sinh tham gia',
      'Tất cả dữ liệu liên quan sẽ bị mất vĩnh viễn'
    ]
  }
]; 