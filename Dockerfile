# Sử dụng image Bun chính thức làm base
FROM oven/bun:1.1.38-alpine AS base

# Cài đặt phụ thuộc chỉ khi cần
FROM base AS deps
WORKDIR /app

# Sao chép package.json và bun.lockb để cài đặt phụ thuộc
COPY package.json bun.lock ./

# Cài đặt phụ thuộc bằng Bun, bao gồm cả devDependencies
RUN bun install --frozen-lockfile

# Giai đoạn build
FROM base AS builder
WORKDIR /app

# Sao chép phụ thuộc từ giai đoạn deps
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Thiết lập môi trường cho build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build ứng dụng
RUN bun run build

# Image sản xuất
FROM base AS runner
WORKDIR /app

# Thiết lập môi trường
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Tạo user không phải root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Sao chép public directory trước khi chuyển ownership
COPY --from=builder /app/public ./public

# Thiết lập quyền cho thư mục cache prerender
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Sao chép output build độc lập
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Đảm bảo quyền truy cập cho public directory
RUN chown -R nextjs:nodejs ./public

# Chuyển sang user không phải root
USER nextjs

# Mở cổng
EXPOSE 3000

# Thiết lập biến môi trường cho cổng
ENV PORT=3000

# Khởi động ứng dụng
CMD ["bun", "run", "server.js"]