import { DetailedInstruction } from '@/components/ui/TabbedHelpModal';

export const examInstructions: DetailedInstruction[] = [
  {
    operation: 'create',
    title: 'Tạo đề thi mới',
    description: 'Hướng dẫn chi tiết cách tạo đề thi với câu hỏi được chọn',
    permission: 'exam:create',
    formFields: [
      {
        name: 'name',
        label: 'Tên đề thi',
        type: 'text',
        required: true,
        description: 'Tên mô tả rõ ràng cho đề thi',
        placeholder: 'Nhập tên đề thi...',
        validation: {
          field: 'name',
          rules: [
            'Bắt buộc phải nhập',
            'Tối thiểu 5 ký tự',
            'Nên bao gồm môn học và kỳ thi',
            'Tránh sử dụng ký tự đặc biệt'
          ],
          examples: [
            'Kiểm tra Toán Học - Giữa kỳ 1',
            'Đề thi Tiếng Anh - Cuối kỳ',
            'Luyện tập Lập Trình Web - Chương 1'
          ]
        }
      },
      {
        name: 'duration',
        label: 'Thời gian (phút)',
        type: 'number',
        required: true,
        description: 'Thời gian làm bài tính bằng phút',
        placeholder: '60',
        validation: {
          field: 'duration',
          rules: [
            'Bắt buộc phải nhập',
            'Tối thiểu 1 phút',
            'Tối đa 300 phút (5 tiếng)',
            'Nên phù hợp với số câu hỏi'
          ],
          examples: ['30 (cho 10-15 câu)', '60 (cho 20-30 câu)', '90 (cho 40-50 câu)']
        }
      },
      {
        name: 'examType',
        label: 'Loại đề thi',
        type: 'select',
        required: true,
        description: 'Phân loại mục đích sử dụng của đề thi',
        options: ['practice', 'official'],
        validation: {
          field: 'examType',
          rules: [
            'Bắt buộc phải chọn',
            'Practice: Để luyện tập, không tính điểm chính thức',
            'Official: Đề thi chính thức, tính vào kết quả học tập'
          ]
        }
      },
      {
        name: 'subjectId',
        label: 'Môn học',
        type: 'select',
        required: true,
        description: 'Chọn môn học mà đề thi thuộc về',
        validation: {
          field: 'subjectId',
          rules: [
            'Bắt buộc phải chọn',
            'Chỉ hiển thị câu hỏi của môn học được chọn',
            'Không thể thay đổi sau khi có sinh viên làm bài'
          ]
        }
      },
      {
        name: 'totalQuestions',
        label: 'Số câu hỏi',
        type: 'number',
        required: true,
        description: 'Tổng số câu hỏi trong đề thi',
        placeholder: '10',
        validation: {
          field: 'totalQuestions',
          rules: [
            'Bắt buộc phải nhập',
            'Tối thiểu 1 câu hỏi',
            'Tối đa 100 câu hỏi',
            'Nên phù hợp với thời gian làm bài'
          ],
          examples: ['10-15 (đề ngắn)', '20-30 (đề trung bình)', '40-50 (đề dài)']
        }
      },
      {
        name: 'questionIds',
        label: 'Câu hỏi được chọn',
        type: 'checkbox-list',
        required: false,
        description: 'Chọn các câu hỏi cụ thể cho đề thi (tùy chọn)',
        validation: {
          field: 'questionIds',
          rules: [
            'Không bắt buộc',
            'Có thể chọn thủ công hoặc để trống',
            'Số câu chọn nên khớp với tổng số câu hỏi',
            'Có thể sử dụng tính năng chọn ngẫu nhiên'
          ]
        }
      }
    ],
    steps: [
      'Nhấn vào nút "+ Thêm đề thi" ở góc trên bên phải',
      'Nhập tên đề thi mô tả rõ ràng',
      'Đặt thời gian làm bài phù hợp (tính bằng phút)',
      'Chọn loại đề thi: Luyện tập hoặc Chính thức',
      'Chọn môn học từ danh sách dropdown',
      'Nhập tổng số câu hỏi mong muốn',
      'Tùy chọn: Chọn câu hỏi cụ thể từ danh sách hiển thị',
      'Sử dụng nút "Chọn ngẫu nhiên" để tự động chọn câu hỏi',
      'Hoặc sử dụng "Chọn tất cả" nếu muốn dùng hết câu hỏi',
      'Xem trước câu hỏi bằng nút "👁️" nếu cần',
      'Kiểm tra lại tất cả thông tin',
      'Nhấn "Lưu" để tạo đề thi và chuyển sang chỉnh sửa',
      'Hoặc nhấn "Lưu & Thoát" để tạo và quay về danh sách'
    ],
    tips: [
      'Tên đề thi nên bao gồm môn học và mục đích',
      'Thời gian: 2-3 phút cho mỗi câu hỏi trắc nghiệm',
      'Chọn "Luyện tập" cho đề ôn thi, "Chính thức" cho kiểm tra',
      'Có thể tạo đề không có câu hỏi và thêm sau',
      'Sử dụng chọn ngẫu nhiên để tạo đề đa dạng',
      'Xem trước câu hỏi để đảm bảo chất lượng'
    ],
    warnings: [
      'Loại đề thi ảnh hưởng đến cách tính điểm',
      'Môn học không thể thay đổi sau khi có kết quả',
      'Thời gian quá ngắn sẽ khiến sinh viên làm vội',
      'Số câu hỏi nhiều cần thời gian tương ứng',
      'Chỉ giáo viên môn học mới có quyền tạo đề thi',
      'Đề thi chính thức cần được phê duyệt'
    ],
    additionalNotes: [
      'Hệ thống sẽ tự động gán ID cho đề thi mới',
      'Có thể chỉnh sửa đề thi sau khi tạo',
      'Đề thi sẽ xuất hiện trong danh sách ngay lập tức',
      'Cần gán lịch thi để sinh viên có thể làm bài'
    ]
  },
  {
    operation: 'edit',
    title: 'Chỉnh sửa đề thi',
    description: 'Hướng dẫn cách cập nhật thông tin và câu hỏi của đề thi',
    permission: 'exam:update',
    formFields: [
      {
        name: 'name',
        label: 'Tên đề thi',
        type: 'text',
        required: true,
        description: 'Cập nhật tên đề thi nếu cần thiết',
        validation: {
          field: 'name',
          rules: [
            'Bắt buộc phải nhập',
            'Cẩn thận khi sửa tên đề đã có sinh viên làm',
            'Tên mới nên phản ánh đúng nội dung',
            'Thông báo cho sinh viên nếu có thay đổi lớn'
          ]
        }
      },
      {
        name: 'duration',
        label: 'Thời gian (phút)',
        type: 'number',
        required: true,
        description: 'Điều chỉnh thời gian làm bài',
        validation: {
          field: 'duration',
          rules: [
            'Bắt buộc phải nhập',
            'Không nên giảm thời gian nếu đã có người làm',
            'Tăng thời gian cần thông báo trước',
            'Phải phù hợp với số câu hỏi hiện tại'
          ]
        }
      },
      {
        name: 'examType',
        label: 'Loại đề thi',
        type: 'select',
        required: true,
        description: 'Thay đổi loại đề thi (cẩn thận với đề đã có kết quả)',
        validation: {
          field: 'examType',
          rules: [
            'Cẩn thận khi chuyển từ Chính thức sang Luyện tập',
            'Có thể ảnh hưởng đến cách tính điểm',
            'Cần thông báo cho sinh viên khi thay đổi'
          ]
        }
      },
      {
        name: 'subjectId',
        label: 'Môn học',
        type: 'select',
        required: true,
        description: 'Thay đổi môn học (chỉ nên làm khi chưa có kết quả)',
        validation: {
          field: 'subjectId',
          rules: [
            'Rất cẩn thận khi thay đổi môn học',
            'Sẽ ảnh hưởng đến danh sách câu hỏi',
            'Có thể làm mất câu hỏi đã chọn',
            'Nên tạo đề mới thay vì đổi môn học'
          ]
        }
      },
      {
        name: 'totalQuestions',
        label: 'Số câu hỏi',
        type: 'number',
        required: true,
        description: 'Cập nhật tổng số câu hỏi',
        validation: {
          field: 'totalQuestions',
          rules: [
            'Điều chỉnh cả thời gian khi thay đổi số câu',
            'Có thể cần chọn lại câu hỏi',
            'Thông báo cho sinh viên nếu đã có lịch thi'
          ]
        }
      },
      {
        name: 'questionIds',
        label: 'Câu hỏi được chọn',
        type: 'checkbox-list',
        required: false,
        description: 'Thêm, bớt hoặc thay đổi câu hỏi trong đề thi',
        validation: {
          field: 'questionIds',
          rules: [
            'Có thể thêm câu hỏi mới hoặc bỏ câu cũ',
            'Cẩn thận khi thay đổi câu hỏi đã có kết quả',
            'Kiểm tra độ khó và tính cân bằng',
            'Thử nghiệm đề sau khi chỉnh sửa'
          ]
        }
      }
    ],
    steps: [
      'Tìm đề thi cần chỉnh sửa trong danh sách',
      'Nhấn vào biểu tượng bút chì (✏️) ở cột "Hành động"',
      'Trang chỉnh sửa sẽ mở với thông tin hiện tại',
      'Xem lại thông tin chi tiết ở phần cuối trang',
      'Cập nhật các thông tin cơ bản nếu cần',
      'Thay đổi danh sách câu hỏi:',
      '  - Bỏ chọn câu hỏi không muốn dùng',
      '  - Tick chọn câu hỏi mới',
      '  - Sử dụng "Chọn ngẫu nhiên" để làm mới',
      '  - Dùng "Xóa tất cả" để chọn lại từ đầu',
      'Xem trước câu hỏi để kiểm tra chất lượng',
      'Nhấn "Lưu" để cập nhật và ở lại trang',
      'Hoặc nhấn "Lưu & Thoát" để lưu và quay về danh sách'
    ],
    tips: [
      'Kiểm tra thông tin chi tiết trước khi sửa',
      'Backup danh sách câu hỏi cũ nếu cần',
      'Cân bằng độ khó khi thay đổi câu hỏi',
      'Test đề thi sau khi chỉnh sửa',
      'Thông báo cho sinh viên khi có thay đổi lớn',
      'Sử dụng "Lưu" nếu muốn tiếp tục chỉnh sửa'
    ],
    warnings: [
      'Thay đổi đề thi có thể ảnh hưởng đến kết quả đã có',
      'Đổi môn học sẽ làm mất câu hỏi đã chọn',
      'Giảm thời gian có thể gây bất công cho sinh viên',
      'Chỉ sửa đề chưa có lịch thi hoặc kết quả',
      'Thay đổi lớn cần sự đồng ý của trưởng bộ môn',
      'Một số thay đổi có thể cần tạo đề mới'
    ],
    additionalNotes: [
      'Thay đổi có hiệu lực ngay lập tức',
      'Hệ thống ghi lại lịch sử chỉnh sửa',
      'Có thể xem log thay đổi trong hệ thống',
      'Đề đã chỉnh sửa vẫn giữ nguyên ID'
    ]
  },
  {
    operation: 'delete',
    title: 'Xóa đề thi',
    description: 'Hướng dẫn cách xóa đề thi khỏi hệ thống',
    permission: 'exam:delete',
    steps: [
      'Tìm đề thi cần xóa trong danh sách',
      'Nhấn vào biểu tượng thùng rác (🗑️) ở cột "Hành động"',
      'Hộp thoại xác nhận sẽ hiển thị thông tin đề thi',
      'Đọc kỹ cảnh báo về hậu quả của việc xóa',
      'Kiểm tra xem đề thi có đang được sử dụng không',
      'Nhấn "Xác nhận" để tiến hành xóa đề thi',
      'Hoặc nhấn "Hủy" để giữ lại đề thi',
      'Đề thi sẽ bị xóa vĩnh viễn khỏi hệ thống'
    ],
    tips: [
      'Kiểm tra kỹ thông tin đề thi trước khi xóa',
      'Đảm bảo không còn lịch thi nào sử dụng đề này',
      'Export đề thi quan trọng trước khi xóa',
      'Xem xét archive thay vì xóa hoàn toàn',
      'Thông báo cho giáo viên liên quan',
      'Kiểm tra không có sinh viên đang làm bài'
    ],
    warnings: [
      'THAO TÁC NÀY KHÔNG THỂ HOÀN TÁC!',
      'Tất cả kết quả thi liên quan sẽ bị mất',
      'Lịch thi đã lên kế hoạch sẽ bị ảnh hưởng',
      'Dữ liệu thống kê về đề thi sẽ bị xóa',
      'Chỉ admin hoặc trưởng bộ môn mới có quyền xóa',
      'Không thể xóa đề thi đang có người làm bài',
      'Việc xóa có thể ảnh hưởng đến kế hoạch giảng dạy'
    ],
    additionalNotes: [
      'Xem xét sử dụng tính năng "ẩn đề thi" thay vì xóa',
      'Một số dữ liệu log có thể vẫn tồn tại',
      'Liên hệ admin hệ thống nếu cần khôi phục',
      'Việc xóa sẽ được ghi log để kiểm tra sau này'
    ]
  }
];

// Permissions mapping for exam feature
export const examPermissions = {
  create: 'exam:create',
  edit: 'exam:update', 
  delete: 'exam:delete',
  export: 'exam:view',
  import: 'exam:create'
}; 