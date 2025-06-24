import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  let accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (accessToken) {
    try {
      const [, payloadB64] = accessToken.split('.');
      const payload = JSON.parse(atob(payloadB64));
      // Thêm buffer 30 giây để tránh trường hợp token hết hạn ngay sau khi kiểm tra
      if (typeof payload.exp === 'number' && Date.now() / 1000 >= payload.exp - 30) {
        accessToken = undefined;
      }
    } catch {
      accessToken = undefined;
    }
  }

  if ((!accessToken && !refreshToken)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!accessToken && refreshToken) {
    try {
      // Sử dụng URL từ biến môi trường nếu có
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const refreshUrl = `${apiUrl}/auth/refresh-token`;
      
      const refreshRes = await fetch(refreshUrl, {
        method: 'POST',
        headers: { 
          Cookie: `refreshToken=${refreshToken}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Đảm bảo cookies được gửi và nhận
      });

      if (!refreshRes.ok) {
        // Clear cookies và redirect về login
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        return response;
      }

      // Lấy response data để extract access token
      const setCookieHeaders = refreshRes.headers.getSetCookie();
      
      if (setCookieHeaders.length > 0) {
        const response = NextResponse.next();
        
        // Set tất cả cookies từ response
        setCookieHeaders.forEach(cookie => {
          response.headers.append('set-cookie', cookie);
        });
        
        return response;
      } else {
        // Kiểm tra nếu có accessToken trong response body
        try {
          const data = await refreshRes.json();
          if (data.accessToken) {
            const response = NextResponse.next();
            // Thiết lập cookie từ dữ liệu trả về
            response.cookies.set('accessToken', data.accessToken, {
              path: '/',
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 15 * 60, // 15 phút
            });
            return response;
          }
        } catch (e) {
          console.error('Error parsing refresh token response:', e);
        }
        
        // Fallback: clear cookies và redirect
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('accessToken');
        response.cookies.delete('refreshToken');
        return response;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear cookies và redirect về login khi có lỗi
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|login|for-bidden|active-account|activate|forgot-password|reset-password).*)'
  ],
};