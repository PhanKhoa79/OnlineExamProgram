import { DetailedInstruction } from '@/components/ui/TabbedHelpModal';

export const questionInstructions: DetailedInstruction[] = [
  {
    operation: 'create',
    title: 'Thêm câu hỏi mới',
    description: 'Hướng dẫn chi tiết cách tạo câu hỏi trắc nghiệm với đáp án',
    permission: 'question:create',
    formFields: [
      {
        name: 'questionText',
        label: 'Nội dung câu hỏi',
        type: 'textarea',
        required: true,
        description: 'Nội dung chính của câu hỏi cần đặt ra cho học sinh',
        placeholder: 'Nhập nội dung câu hỏi...',
        validation: {
          field: 'questionText',
          rules: [
            'Bắt buộc phải nhập',
            'Câu hỏi phải rõ ràng và dễ hiểu',
            'Tránh câu hỏi có nhiều nghĩa',
            'Nên có độ dài vừa phải'
          ],
          examples: [
            'Thủ đô của Việt Nam là gì?',
            'Phương trình x² + 2x - 3 = 0 có nghiệm là?',
            'Trong JavaScript, từ khóa nào dùng để khai báo biến?'
          ]
        }
      },
      {
        name: 'subjectId',
        label: 'Môn học',
        type: 'select',
        required: true,
        description: 'Chọn môn học mà câu hỏi này thuộc về',
        validation: {
          field: 'subjectId',
          rules: [
            'Bắt buộc phải chọn',
            'Chọn môn học phù hợp với nội dung câu hỏi',
            'Môn học sẽ quyết định nhóm câu hỏi trong đề thi'
          ]
        }
      },
      {
        name: 'difficultyLevel',
        label: 'Độ khó',
        type: 'select',
        required: true,
        description: 'Mức độ khó của câu hỏi để phân loại trong đề thi',
        options: ['dễ', 'trung bình', 'khó'],
        validation: {
          field: 'difficultyLevel',
          rules: [
            'Mặc định là "trung bình"',
            'Dễ: Câu hỏi cơ bản, kiến thức nền tảng',
            'Trung bình: Câu hỏi áp dụng kiến thức',
            'Khó: Câu hỏi phân tích, tổng hợp'
          ]
        }
      },
      {
        name: 'answers',
        label: 'Câu trả lời',
        type: 'dynamic-list',
        required: true,
        description: 'Danh sách các đáp án cho câu hỏi (tối thiểu 2 đáp án)',
        validation: {
          field: 'answers',
          rules: [
            'Cần có ít nhất 2 câu trả lời',
            'Phải có ít nhất 1 câu trả lời đúng',
            'Mỗi câu trả lời phải có nội dung',
            'Chỉ được chọn 1 đáp án đúng cho mỗi câu hỏi'
          ],
          examples: [
            'A. Hà Nội | B. TP.HCM | C. Đà Nẵng | D. Cần Thơ',
            'A. x = 1, x = -3 | B. x = 2, x = -1 | C. x = 0, x = 3',
            'A. var | B. let | C. const | D. function'
          ]
        }
      },
      {
        name: 'imageUrl',
        label: 'URL hình ảnh',
        type: 'url',
        required: false,
        description: 'Đường link hình ảnh minh họa cho câu hỏi (tùy chọn)',
        placeholder: 'https://example.com/image.jpg',
        validation: {
          field: 'imageUrl',
          rules: [
            'Không bắt buộc',
            'Phải là URL hình ảnh hợp lệ',
            'Nên sử dụng định dạng JPG, PNG, GIF',
            'Kích thước không quá 5MB'
          ]
        }
      },
      {
        name: 'audioUrl',
        label: 'URL âm thanh',
        type: 'url',
        required: false,
        description: 'Đường link file âm thanh cho câu hỏi nghe (tùy chọn)',
        placeholder: 'https://example.com/audio.mp3',
        validation: {
          field: 'audioUrl',
          rules: [
            'Không bắt buộc',
            'Phải là URL âm thanh hợp lệ',
            'Nên sử dụng định dạng MP3, WAV',
            'Thời lượng không quá 5 phút'
          ]
        }
      },
      {
        name: 'passageText',
        label: 'Đoạn văn',
        type: 'textarea',
        required: false,
        description: 'Đoạn văn bản liên quan đến câu hỏi (tùy chọn)',
        placeholder: 'Nhập đoạn văn liên quan đến câu hỏi...',
        validation: {
          field: 'passageText',
          rules: [
            'Không bắt buộc',
            'Sử dụng cho câu hỏi đọc hiểu',
            'Đoạn văn nên ngắn gọn và liên quan',
            'Tránh đoạn văn quá dài gây khó đọc'
          ]
        }
      }
    ],
    steps: [
      'Nhấn vào nút "+ Thêm câu hỏi" ở góc trên bên phải của trang danh sách',
      'Nhập nội dung câu hỏi rõ ràng và chính xác',
      'Chọn môn học phù hợp từ danh sách dropdown',
      'Chọn mức độ khó: Dễ, Trung bình, hoặc Khó',
      'Nhập ít nhất 2 câu trả lời trong phần "Câu trả lời"',
      'Chọn 1 đáp án đúng bằng cách tick radio button',
      'Tùy chọn: Thêm URL hình ảnh minh họa nếu cần',
      'Tùy chọn: Thêm URL âm thanh cho câu hỏi nghe',
      'Tùy chọn: Thêm đoạn văn cho câu hỏi đọc hiểu',
      'Sử dụng nút "Thêm câu trả lời" để tạo thêm đáp án',
      'Kiểm tra lại tất cả thông tin đã nhập',
      'Nhấn "Lưu" để tạo câu hỏi và chuyển sang trang chỉnh sửa',
      'Hoặc nhấn "Lưu & Thoát" để tạo câu hỏi và quay về danh sách'
    ],
    tips: [
      'Câu hỏi nên ngắn gọn, rõ ràng và chính xác',
      'Đáp án nhiễu nên hợp lý để tăng độ khó',
      'Sử dụng hình ảnh để làm rõ câu hỏi',
      'Âm thanh hữu ích cho câu hỏi tiếng Anh, âm nhạc',
      'Có thể tạo 3-4 đáp án để tăng tính khách quan',
      'Kiểm tra chính tả và ngữ pháp trước khi lưu'
    ],
    warnings: [
      'Phải có ít nhất 2 câu trả lời để tạo câu hỏi',
      'Bắt buộc phải chọn 1 đáp án đúng',
      'Câu hỏi phải thuộc 1 môn học cụ thể',
      'URL hình ảnh/âm thanh phải truy cập được',
      'Không thể để trống nội dung câu hỏi',
      'Chỉ giáo viên môn học mới có quyền tạo câu hỏi'
    ],
    additionalNotes: [
      'Hệ thống sẽ tự động gán ID cho câu hỏi mới',
      'Câu hỏi mới sẽ xuất hiện trong ngân hàng câu hỏi',
      'Có thể chỉnh sửa câu hỏi sau khi tạo',
      'Câu hỏi có thể được sử dụng trong nhiều đề thi khác nhau'
    ]
  },
  {
    operation: 'edit',
    title: 'Chỉnh sửa câu hỏi',
    description: 'Hướng dẫn cách cập nhật nội dung và đáp án của câu hỏi',
    permission: 'question:update',
    formFields: [
      {
        name: 'questionText',
        label: 'Nội dung câu hỏi',
        type: 'textarea',
        required: true,
        description: 'Cập nhật nội dung câu hỏi nếu cần thiết',
        validation: {
          field: 'questionText',
          rules: [
            'Bắt buộc phải nhập',
            'Cẩn thận khi sửa câu hỏi đã sử dụng trong đề thi',
            'Đảm bảo câu hỏi mới vẫn phù hợp với đáp án',
            'Thông báo nếu thay đổi ảnh hưởng đến kết quả thi'
          ]
        }
      },
      {
        name: 'subjectId',
        label: 'Môn học',
        type: 'select',
        required: true,
        description: 'Thay đổi môn học nếu câu hỏi thuộc môn khác',
        validation: {
          field: 'subjectId',
          rules: [
            'Bắt buộc phải chọn',
            'Cẩn thận khi chuyển môn học',
            'Có thể ảnh hưởng đến đề thi đã tạo',
            'Đảm bảo câu hỏi phù hợp với môn học mới'
          ]
        }
      },
      {
        name: 'difficultyLevel',
        label: 'Độ khó',
        type: 'select',
        required: true,
        description: 'Cập nhật mức độ khó phù hợp hơn',
        options: ['dễ', 'trung bình', 'khó'],
        validation: {
          field: 'difficultyLevel',
          rules: [
            'Đánh giá lại độ khó sau khi có kết quả thi',
            'Thay đổi độ khó ảnh hưởng đến cấu trúc đề thi',
            'Nên dựa vào tỷ lệ trả lời đúng để điều chỉnh'
          ]
        }
      },
      {
        name: 'answers',
        label: 'Câu trả lời',
        type: 'dynamic-list',
        required: true,
        description: 'Chỉnh sửa các đáp án hiện có hoặc thêm đáp án mới',
        validation: {
          field: 'answers',
          rules: [
            'Vẫn cần ít nhất 2 câu trả lời',
            'Có thể thêm hoặc xóa đáp án',
            'Cẩn thận khi thay đổi đáp án đúng',
            'Đáp án mới phải phù hợp với câu hỏi'
          ]
        }
      }
    ],
    steps: [
      'Tìm câu hỏi cần chỉnh sửa trong bảng danh sách',
      'Nhấn vào biểu tượng bút chì (✏️) ở cột "Hành động"',
      'Trang chỉnh sửa sẽ mở với thông tin hiện tại được điền sẵn',
      'Xem lại thông tin chi tiết ở phần cuối trang',
      'Chỉnh sửa nội dung câu hỏi nếu cần',
      'Cập nhật môn học và độ khó nếu cần thiết',
      'Sửa đổi các đáp án hiện có hoặc thêm đáp án mới',
      'Thay đổi đáp án đúng nếu cần',
      'Cập nhật URL hình ảnh, âm thanh, đoạn văn nếu có',
      'Kiểm tra lại tất cả thay đổi',
      'Nhấn "Lưu" để cập nhật và ở lại trang chỉnh sửa',
      'Hoặc nhấn "Lưu & Thoát" để cập nhật và quay về danh sách'
    ],
    tips: [
      'Xem lại thông tin chi tiết trước khi chỉnh sửa',
      'Kiểm tra ngày tạo và cập nhật cuối',
      'Thử nghiệm câu hỏi sau khi chỉnh sửa',
      'Thông báo cho giáo viên khác nếu có thay đổi lớn',
      'Backup câu hỏi quan trọng trước khi sửa'
    ],
    warnings: [
      'Thay đổi câu hỏi có thể ảnh hưởng đến đề thi đã tạo',
      'Sửa đáp án đúng sẽ ảnh hưởng đến kết quả đã có',
      'Thay đổi môn học có thể làm câu hỏi không phù hợp',
      'Chỉ giáo viên môn học mới có quyền chỉnh sửa',
      'Một số thay đổi có thể cần phê duyệt từ trưởng bộ môn'
    ],
    additionalNotes: [
      'Thay đổi có hiệu lực ngay lập tức',
      'Hệ thống tự động ghi lại thời gian cập nhật',
      'Có thể xem lịch sử thay đổi trong log',
      'Câu hỏi đã sửa vẫn có thể sử dụng cho đề thi mới'
    ]
  },
  {
    operation: 'delete',
    title: 'Xóa câu hỏi',
    description: 'Hướng dẫn cách xóa câu hỏi khỏi ngân hàng câu hỏi',
    permission: 'question:delete',
    steps: [
      'Tìm câu hỏi cần xóa trong bảng danh sách',
      'Nhấn vào biểu tượng thùng rác (🗑️) ở cột "Hành động"',
      'Hộp thoại xác nhận sẽ xuất hiện với thông tin câu hỏi',
      'Đọc kỹ cảnh báo về hậu quả của việc xóa',
      'Nhấn "Xác nhận" để tiến hành xóa câu hỏi',
      'Hoặc nhấn "Hủy" để giữ lại câu hỏi',
      'Câu hỏi sẽ bị xóa vĩnh viễn khỏi hệ thống'
    ],
    tips: [
      'Kiểm tra xem câu hỏi có đang được sử dụng trong đề thi nào không',
      'Export câu hỏi quan trọng trước khi xóa',
      'Xem xét chuyển câu hỏi sang trạng thái ẩn thay vì xóa',
      'Thông báo cho giáo viên khác nếu câu hỏi được chia sẻ',
      'Kiểm tra lịch sử sử dụng của câu hỏi'
    ],
    warnings: [
      'THAO TÁC NÀY KHÔNG THỂ HOÀN TÁC!',
      'Câu hỏi sẽ bị xóa khỏi tất cả đề thi đã tạo',
      'Kết quả thi liên quan có thể bị ảnh hưởng',
      'Đáp án và thống kê liên quan sẽ bị mất',
      'Chỉ giáo viên tạo câu hỏi hoặc admin mới có quyền xóa',
      'Việc xóa có thể ảnh hưởng đến công bằng trong thi cử'
    ],
    additionalNotes: [
      'Xem xét sử dụng tính năng "ẩn câu hỏi" thay vì xóa hẳn',
      'Một số dữ liệu thống kê có thể vẫn lưu lại',
      'Liên hệ admin hệ thống nếu cần khôi phục dữ liệu',
      'Việc xóa sẽ được ghi log để kiểm tra sau này'
    ]
  }
];

// Permissions mapping for question feature
export const questionPermissions = {
  create: 'question:create',
  edit: 'question:update', 
  delete: 'question:delete',
  export: 'question:view',
  import: 'question:create'
}; 