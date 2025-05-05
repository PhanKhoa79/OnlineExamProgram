// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  let accessToken  = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (accessToken) {
    try {
      const [, payloadB64] = accessToken.split('.');
      const payload = JSON.parse(atob(payloadB64));
      if (typeof payload.exp === 'number' && Date.now() / 1000 >= payload.exp) {
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
    const refreshUrl = 'http://localhost:5000/api/auth/refresh-token';
    const refreshRes = await fetch(refreshUrl, {
      method: 'POST',
      headers: { Cookie: `refreshToken=${refreshToken}` },
    });

    if (!refreshRes.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const setCookie = refreshRes.headers.get('set-cookie');
    if (setCookie) {
      const response = NextResponse.redirect(request.nextUrl);
      response.headers.set('set-cookie', setCookie);
      return response;
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
   
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|login).*)'
  ],
};
