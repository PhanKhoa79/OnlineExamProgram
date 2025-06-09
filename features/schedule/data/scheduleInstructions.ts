import { DetailedInstruction } from '@/components/ui/TabbedHelpModal';

export const scheduleInstructions: DetailedInstruction[] = [
  {
    operation: 'create',
    title: 'Thêm lịch thi mới',
    description: 'Hướng dẫn chi tiết cách tạo lịch thi mới với tất cả các trường bắt buộc và validation',
    permission: 'schedule:create',
    formFields: [
      {
        name: 'code',
        label: 'Mã lịch thi',
        type: 'text',
        required: true,
        description: 'Mã định danh duy nhất cho lịch thi',
        placeholder: 'Nhập mã lịch thi',
        validation: {
          field: 'code',
          rules: [
            'Bắt buộc phải nhập',
            'Phải là duy nhất trong hệ thống',
            'Nên sử dụng quy tắc đặt tên rõ ràng'
          ],
          examples: ['SCHEDULE001', 'LT_TOAN_2024', 'FINAL_ENG_SEM1']
        }
      },
      {
        name: 'subjectId',
        label: 'Môn học',
        type: 'select',
        required: true,
        description: 'Chọn môn học cho lịch thi',
        placeholder: 'Chọn môn học',
        validation: {
          field: 'subjectId',
          rules: [
            'Bắt buộc phải chọn',
            'Chỉ có thể chọn một môn học',
            'Danh sách môn học được tải từ hệ thống'
          ],
          examples: ['Toán học', 'Tiếng Anh', 'Vật lý']
        }
      },
      {
        name: 'startTime',
        label: 'Thời gian bắt đầu',
        type: 'date',
        required: true,
        description: 'Thời điểm bắt đầu kỳ thi',
        placeholder: 'Chọn thời gian bắt đầu',
        validation: {
          field: 'startTime',
          rules: [
            'Bắt buộc phải nhập',
            'Phải ở tương lai (không được ở quá khứ)',
            'Định dạng: ngày giờ (datetime-local)'
          ],
          examples: ['2024-12-25 09:00', '2024-01-15 14:30', '2024-06-10 08:00']
        }
      },
      {
        name: 'endTime',
        label: 'Thời gian kết thúc',
        type: 'date',
        required: true,
        description: 'Thời điểm kết thúc kỳ thi',
        placeholder: 'Chọn thời gian kết thúc',
        validation: {
          field: 'endTime',
          rules: [
            'Bắt buộc phải nhập',
            'Phải sau thời gian bắt đầu',
            'Khoảng cách hợp lý với thời gian bắt đầu'
          ],
          examples: ['2024-12-25 11:00', '2024-01-15 16:30', '2024-06-10 11:00']
        }
      },
      {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        required: false,
        description: 'Trạng thái hiện tại của lịch thi (mặc định: Hoạt động)',
        placeholder: 'Chọn trạng thái',
        options: ['Hoạt động', 'Hoàn thành', 'Đã hủy'],
        validation: {
          field: 'status',
          rules: [
            'Không bắt buộc (mặc định: Hoạt động)',
            '3 lựa chọn: Hoạt động, Hoàn thành, Đã hủy'
          ]
        }
      },
      {
        name: 'description',
        label: 'Mô tả',
        type: 'textarea',
        required: false,
        description: 'Thông tin bổ sung về lịch thi',
        placeholder: 'Nhập mô tả cho lịch thi (tùy chọn)',
        validation: {
          field: 'description',
          rules: [
            'Không bắt buộc',
            'Có thể nhập nhiều dòng',
            'Nên mô tả rõ ràng về kỳ thi'
          ],
          examples: [
            'Kỳ thi cuối học kỳ 1 năm học 2024-2025',
            'Thi thử THPT Quốc gia môn Toán',
            'Kiểm tra định kỳ giữa học kỳ'
          ]
        }
      }
    ],
    steps: [
      'Nhấn vào nút "+ Thêm lịch thi" ở góc trên bên phải của trang danh sách',
      'Nhập mã lịch thi duy nhất và dễ nhận biết',
      'Chọn môn học cho kỳ thi từ dropdown',
      'Đặt thời gian bắt đầu (phải ở tương lai)',
      'Đặt thời gian kết thúc (sau thời gian bắt đầu)',
      'Chọn trạng thái phù hợp (mặc định: Hoạt động)',
      'Thêm mô tả nếu cần thiết',
      'Kiểm tra lại thông tin trước khi lưu',
      'Nhấn "Lưu" để tạo và chuyển sang trang chỉnh sửa',
      'Hoặc nhấn "Lưu & Thoát" để tạo và quay về danh sách'
    ],
    tips: [
      'Đặt mã lịch thi theo quy tắc nhất quán để dễ quản lý',
      'Kiểm tra kỹ thời gian để tránh trùng lặp với các kỳ thi khác',
      'Nên đặt thời gian bắt đầu trước ít nhất 1 ngày để chuẩn bị',
      'Thời gian thi nên phù hợp với độ khó và số lượng câu hỏi',
      'Sử dụng mô tả để ghi chú thông tin quan trọng',
      'Có thể chỉnh sửa trạng thái sau khi tạo lịch thi'
    ],
    warnings: [
      'Mã lịch thi phải là duy nhất trong hệ thống',
      'Thời gian bắt đầu phải ở tương lai, không được ở quá khứ',
      'Thời gian kết thúc phải sau thời gian bắt đầu',
      'Lưu ý kiểm tra kỹ thông tin trước khi lưu'
    ],
    additionalNotes: [
      'Hệ thống sẽ tự động kiểm tra tính hợp lệ của thời gian',
      'Có thể tạo nhiều lịch thi liên tiếp bằng cách nhấn "Lưu" thay vì "Lưu & Thoát"',
      'Lịch thi có thể được liên kết với các đề thi cụ thể sau khi tạo'
    ]
  },
  {
    operation: 'edit',
    title: 'Chỉnh sửa lịch thi',
    description: 'Hướng dẫn cách cập nhật thông tin lịch thi hiện có',
    permission: 'schedule:update',
    formFields: [
      {
        name: 'code',
        label: 'Mã lịch thi',
        type: 'text',
        required: true,
        description: 'Mã lịch thi có thể chỉnh sửa',
        validation: {
          field: 'code',
          rules: [
            'Bắt buộc phải nhập',
            'Phải là duy nhất trong hệ thống',
            'Có thể thay đổi nếu cần thiết'
          ]
        }
      },
      {
        name: 'subjectId',
        label: 'Môn học',
        type: 'select',
        required: true,
        description: 'Có thể thay đổi môn học cho lịch thi',
        validation: {
          field: 'subjectId',
          rules: [
            'Bắt buộc phải chọn',
            'Có thể thay đổi môn học nếu cần'
          ]
        }
      },
      {
        name: 'startTime',
        label: 'Thời gian bắt đầu',
        type: 'date',
        required: true,
        description: 'Có thể cập nhật thời gian bắt đầu',
        validation: {
          field: 'startTime',
          rules: [
            'Bắt buộc phải nhập',
            'Có thể cập nhật nếu chưa bắt đầu thi',
            'Vẫn phải ở tương lai nếu thay đổi'
          ]
        }
      },
      {
        name: 'endTime',
        label: 'Thời gian kết thúc',
        type: 'date',
        required: true,
        description: 'Có thể cập nhật thời gian kết thúc',
        validation: {
          field: 'endTime',
          rules: [
            'Bắt buộc phải nhập',
            'Phải sau thời gian bắt đầu',
            'Có thể cập nhật nếu cần thiết'
          ]
        }
      },
      {
        name: 'status',
        label: 'Trạng thái',
        type: 'select',
        required: false,
        description: 'Có thể thay đổi trạng thái lịch thi',
        options: ['Hoạt động', 'Hoàn thành', 'Đã hủy'],
        validation: {
          field: 'status',
          rules: [
            'Có thể thay đổi trạng thái',
            'Lưu ý: Lịch thi đã hoàn thành/hủy khó có thể quay lại hoạt động'
          ]
        }
      },
      {
        name: 'description',
        label: 'Mô tả',
        type: 'textarea',
        required: false,
        description: 'Có thể cập nhật mô tả lịch thi',
        validation: {
          field: 'description',
          rules: [
            'Không bắt buộc',
            'Có thể thêm/sửa/xóa mô tả bất kỳ lúc nào'
          ]
        }
      }
    ],
    steps: [
      'Tìm lịch thi cần chỉnh sửa trong bảng danh sách',
      'Nhấn vào biểu tượng bút chì (✏️) ở cột "Hành động"',
      'Cập nhật các thông tin cần thay đổi',
      'Kiểm tra lại thông tin đã chỉnh sửa',
      'Nhấn "Lưu" để cập nhật và tiếp tục chỉnh sửa',
      'Hoặc nhấn "Lưu & Thoát" để cập nhật và quay về danh sách'
    ],
    tips: [
      'Chỉ chỉnh sửa những thông tin thực sự cần thay đổi',
      'Kiểm tra kỹ thời gian nếu có thay đổi',
      'Cập nhật trạng thái phù hợp với tình hình thực tế',
      'Sử dụng mô tả để ghi chú các thay đổi quan trọng'
    ],
    warnings: [
      'Thay đổi thời gian có thể ảnh hưởng đến thí sinh đã đăng ký',
      'Thay đổi môn học có thể làm mất liên kết với đề thi',
      'Thay đổi trạng thái cần cân nhắc kỹ lưỡng',
      'Lưu ý thông báo cho các bên liên quan nếu có thay đổi lớn'
    ],
    additionalNotes: [
      'Hệ thống sẽ ghi lại lịch sử thay đổi',
      'Có thể xuất báo cáo các thay đổi nếu cần',
      'Thay đổi sẽ có hiệu lực ngay lập tức'
    ]
  },
  {
    operation: 'delete',
    title: 'Xóa lịch thi',
    description: 'Hướng dẫn cách xóa lịch thi khỏi hệ thống',
    permission: 'schedule:delete',
    steps: [
      'Tìm lịch thi cần xóa trong bảng danh sách',
      'Nhấn vào biểu tượng thùng rác (🗑️) ở cột "Hành động"',
      'Đọc kỹ thông báo xác nhận trong hộp thoại',
      'Nhấn "Xác nhận" để thực hiện xóa',
      'Lịch thi sẽ bị xóa vĩnh viễn khỏi hệ thống'
    ],
    tips: [
      'Kiểm tra kỹ trước khi xóa để đảm bảo đúng lịch thi',
      'Xuất dữ liệu backup trước khi xóa nếu cần thiết',
      'Thông báo cho các bên liên quan trước khi xóa'
    ],
    warnings: [
      'Thao tác xóa KHÔNG THỂ hoàn tác',
      'Xóa lịch thi sẽ xóa vĩnh viễn, không thể khôi phục',
      'Kiểm tra xem có thí sinh đã đăng ký thi hay không',
      'Cân nhắc thay đổi trạng thái thành "Đã hủy" thay vì xóa'
    ],
    additionalNotes: [
      'Chỉ xóa những lịch thi thực sự không còn cần thiết',
      'Có thể sử dụng tính năng lọc để tìm lịch thi cần xóa',
      'Hệ thống sẽ ghi lại thông tin xóa để audit'
    ]
  }
]; 