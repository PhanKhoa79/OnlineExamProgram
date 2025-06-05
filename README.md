# 🎓 Online Exam Program

<div align="center">
  <img src="./public/logo.png" alt="Online Exam Program Logo" width="120" height="120">
  
  ### 🚀 Hệ thống thi trực tuyến hiện đại và thông minh
  
  ![Next.js](https://img.shields.io/badge/Next.js-15.3.0-black?style=for-the-badge&logo=next.js)
  ![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.4-38B2AC?style=for-the-badge&logo=tailwind-css)
  ![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.8.2-764ABC?style=for-the-badge&logo=redux)
  ![Bun](https://img.shields.io/badge/Bun-Latest-000000?style=for-the-badge&logo=bun)
</div>

---

## 📋 Giới thiệu dự án

**Online Exam Program** là một hệ thống thi trực tuyến toàn diện được phát triển với công nghệ hiện đại, mang đến trải nghiệm thi cử mượt mà và bảo mật cao cho cả học sinh và giáo viên.

### 🛠️ Công nghệ sử dụng

#### 🎨 **Frontend Framework**
- **Next.js 15.3.0** (App Router) - Framework React mạnh mẽ
- **React 19.0.0** - Thư viện UI hiện đại
- **TypeScript 5.0** - Ngôn ngữ lập trình an toàn kiểu

#### 🎯 **State Management**
- **Redux Toolkit 2.8.2** - Quản lý state toàn cục
- **Zustand 5.0.4** - State management nhẹ và linh hoạt

#### 💅 **UI/UX Libraries**
- **Tailwind CSS 4.1.4** - Framework CSS utility-first
- **Shadcn/UI** - Component library hiện đại
- **Radix UI** - Primitive components accessible
- **Material-UI 7.0.2** - Component library Google
- **Lucide React** - Bộ icon đẹp và nhất quán

#### 📊 **Data Visualization**
- **Recharts 2.15.3** - Thư viện biểu đồ React
- **TanStack Table** - Bảng dữ liệu mạnh mẽ

#### 🔧 **Form & Validation**
- **React Hook Form 7.56.3** - Quản lý form hiệu quả
- **Zod 3.24.4** - Schema validation TypeScript-first

#### 🌐 **HTTP Client**
- **Axios 1.9.0** - HTTP client với interceptors

#### 🔐 **Authentication**
- **JSON Web Token 9.0.2** - Xác thực bảo mật

---

## 🚀 Cách khởi động dự án

### 📋 **Yêu cầu hệ thống**
- **Node.js** >= 18.0.0
- **Bun** >= 1.0.0 (khuyến nghị - package manager chính)

### ⚡ **Cài đặt nhanh**

```bash
# 1️⃣ Clone repository
git clone <repository-url>
cd OnlineExamProgram

# 2️⃣ Cài đặt Bun (nếu chưa có)
# Windows PowerShell:
powershell -c "irm bun.sh/install.ps1 | iex"

# macOS/Linux:
curl -fsSL https://bun.sh/install | bash

# 3️⃣ Cài đặt dependencies với Bun
bun install

# 4️⃣ Chạy development server
bun dev
```

### 🌐 **Truy cập ứng dụng**
Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt để xem kết quả.

### 📝 **Scripts có sẵn**
```bash
bun dev          # 🏃‍♂️ Chạy development server với Turbopack
bun run build    # 🏗️ Build ứng dụng cho production  
bun start        # ▶️ Chạy ứng dụng production
bun run lint     # 🔍 Kiểm tra linting

# Alternative package managers (không khuyến nghị):
# npm run dev / yarn dev / pnpm dev
```

### 🔄 **Migration từ npm/pnpm sang Bun**

Nếu bạn đang có project cũ với npm/pnpm:

```powershell
# Windows PowerShell:
# 1. Backup các file lock cũ
New-Item -ItemType Directory -Path "package-managers-backup" -Force
Copy-Item "package-lock.json" "package-managers-backup/" -ErrorAction SilentlyContinue
Copy-Item "pnpm-lock.yaml" "package-managers-backup/" -ErrorAction SilentlyContinue
Copy-Item "pnpm-workspace.yaml" "package-managers-backup/" -ErrorAction SilentlyContinue

# 2. Xóa file lock cũ và node_modules
Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue
Remove-Item "pnpm-lock.yaml" -Force -ErrorAction SilentlyContinue
Remove-Item "pnpm-workspace.yaml" -Force -ErrorAction SilentlyContinue
Remove-Item "node_modules" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Cài đặt với Bun
bun install
```

### ⚡ **Tại sao chọn Bun?**

- 🚀 **Tốc độ nhanh hơn**: 2-10x nhanh hơn npm/yarn/pnpm
- 🛠️ **All-in-one**: Package manager + bundler + test runner + runtime
- 🔧 **Tương thích 100%**: Hoạt động với mọi package npm
- 📦 **Built-in TypeScript**: Chạy TypeScript trực tiếp không cần build
- 🔒 **Bảo mật**: Lock file binary nhanh và an toàn hơn

---

## ✨ Tính năng chính

### 👨‍🎓 **Dành cho Học sinh**
- 🔐 **Đăng nhập bảo mật** với xác thực JWT
- 📚 **Tham gia bài thi** trực tuyến
- ⏰ **Đồng hồ đếm ngược** thời gian làm bài
- 💾 **Lưu trữ tự động** đáp án
- 📊 **Xem kết quả** chi tiết sau khi thi
- 📱 **Responsive design** - Tương thích mọi thiết bị

### 👨‍🏫 **Dành cho Giáo viên/Admin**
- 📋 **Quản lý đề thi** và ngân hàng câu hỏi
- 👥 **Quản lý học sinh** và lớp học
- 📈 **Dashboard thống kê** chi tiết
- ⚙️ **Cấu hình bài thi** linh hoạt
- 📊 **Báo cáo kết quả** tự động
- 🔧 **Phân quyền người dùng** theo vai trò

### 🛡️ **Bảo mật & Hiệu suất**
- 🔒 **Xác thực JWT** an toàn
- 🚫 **Middleware bảo vệ** route
- ⚡ **Server-side rendering** với Next.js
- 📱 **PWA-ready** cho trải nghiệm mobile tốt nhất
- 🎨 **Dark/Light mode** theo sở thích người dùng

---

## 🖼️ Preview giao diện

### 🔐 **Trang đăng nhập**
<div align="center">
  <img src="./public/preview/login-page.png" alt="Login Page" width="600">
  <p><em>Giao diện đăng nhập hiện đại với validation form</em></p>
</div>

### 🏠 **Dashboard Admin**
<div align="center">
  <img src="./public/preview/admin-dashboard.png" alt="Admin Dashboard" width="600">
  <p><em>Dashboard quản trị với biểu đồ thống kê trực quan</em></p>
</div>

### 📝 **Giao diện làm bài thi**
<div align="center">
  <img src="./public/preview/exam-interface.png" alt="Exam Interface" width="600">
  <p><em>Giao diện làm bài thi với đồng hồ đếm ngược và điều hướng câu hỏi</em></p>
</div>

### 👨‍🎓 **Trang chủ học sinh**
<div align="center">
  <img src="./public/preview/student-home.png" alt="Student Home" width="600">
  <p><em>Trang chủ học sinh với danh sách bài thi và thông báo</em></p>
</div>

### 📊 **Báo cáo kết quả**
<div align="center">
  <img src="./public/preview/result-report.png" alt="Result Report" width="600">
  <p><em>Báo cáo kết quả chi tiết với biểu đồ phân tích</em></p>
</div>

---

## 📱 Responsive Design

Ứng dụng được thiết kế responsive tối ưu cho mọi thiết bị:

| 📱 Mobile | 📱 Tablet | 💻 Laptop | 🖥️ Desktop |
|-----------|-----------|-----------|------------|
| ≤ 640px   | 641-768px | 769-1280px| > 1280px   |

---

## 🏗️ Cấu trúc dự án

```
📁 OnlineExamProgram/
├── 📁 src/app/              # 🛣️ App Router (Next.js 15)
│   ├── 📁 (auth)/           # 🔐 Authentication routes
│   ├── 📁 (student)/        # 👨‍🎓 Student routes
│   ├── 📁 dashboard/        # 📊 Admin dashboard
│   └── 📁 account/          # 👤 User account
├── 📁 components/           # 🧩 Reusable components
│   ├── 📁 ui/               # 🎨 UI components
│   ├── 📁 dashboard/        # 📊 Dashboard components
│   └── 📁 student/          # 👨‍🎓 Student components
├── 📁 features/             # 🎯 Feature modules
│   ├── 📁 auth/             # 🔐 Authentication
│   ├── 📁 exam/             # 📝 Exam management
│   ├── 📁 question/         # ❓ Question bank
│   ├── 📁 student/          # 👥 Student management
│   └── 📁 subject/          # 📚 Subject management
├── 📁 hooks/                # 🎣 Custom React hooks
├── 📁 lib/                  # 📚 Utility libraries
├── 📁 store/                # 🗄️ Global state management
├── 📁 types/                # 📝 TypeScript definitions
└── 📁 public/               # 🌐 Static assets
```

---

## 🤝 Đóng góp

Chúng tôi luôn chào đón các đóng góp từ cộng đồng! 

### 📝 **Quy trình đóng góp:**
1. 🍴 Fork repository
2. 🌿 Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to branch (`git push origin feature/AmazingFeature`)
5. 🔄 Tạo Pull Request

---

## 📞 Liên hệ & Hỗ trợ

- 📧 **Email**: phankhoa1379@gmail.com
- 🌐 **Website**: https://www.facebook.com/phan.khoa.905202/


---

## 📄 License

Dự án này được phân phối dưới giấy phép MIT License. Xem file `LICENSE` để biết thêm chi tiết.

---

<div align="center">
  <p>Made with ❤️ by Online Phan Khoa</p>
  <p>🌟 Nếu thấy dự án hữu ích, hãy cho chúng tôi một star nhé! 🌟</p>
</div>
