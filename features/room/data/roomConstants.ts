export const ROOM_STATUS_OPTIONS = [
  { value: 'waiting', label: 'Chờ mở', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'open', label: 'Đang mở', color: 'bg-green-100 text-green-800' },
  { value: 'closed', label: 'Đã đóng', color: 'bg-red-100 text-red-800' },
] as const;

export const ROOM_STATUS_COLORS = {
  waiting: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  open: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-red-100 text-red-800 border-red-200',
} as const;

export const DEFAULT_MAX_PARTICIPANTS = 30;

export const ROOM_CODE_PREFIX = 'ROOM';

export const ROOM_FORM_VALIDATION = {
  code: {
    required: 'Mã phòng thi là bắt buộc',
    maxLength: { value: 50, message: 'Mã phòng thi không được vượt quá 50 ký tự' },
    pattern: {
      value: /^[A-Z0-9_-]+$/,
      message: 'Mã phòng thi chỉ được chứa chữ hoa, số, dấu gạch dưới và dấu gạch ngang'
    }
  },
  maxParticipants: {
    min: { value: 1, message: 'Số người tham gia tối thiểu là 1' },
    max: { value: 100, message: 'Số người tham gia tối đa là 100' }
  },
  description: {
    maxLength: { value: 500, message: 'Mô tả không được vượt quá 500 ký tự' }
  }
} as const; 