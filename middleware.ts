import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// CSRF token cookie name
const CSRF_COOKIE = 'csrf_token';
// CSRF token header name
const CSRF_HEADER = 'X-CSRF-Token';

// Generate a new CSRF token using Web Crypto API
const generateToken = async () => {
  const buffer = new Uint8Array(32);
  crypto.getRandomValues(buffer);
  return Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// Check if the request is safe (GET, HEAD, OPTIONS)
const isSafeMethod = (method: string) => ['GET', 'HEAD', 'OPTIONS'].includes(method);

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Handle CSRF token
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const method = request.method;
    const csrfToken = request.cookies.get(CSRF_COOKIE)?.value;
    const headerToken = request.headers.get(CSRF_HEADER);

    // For safe methods, just ensure a token exists
    if (isSafeMethod(method)) {
      if (!csrfToken) {
        const newToken = await generateToken();
        response.cookies.set(CSRF_COOKIE, newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
        });
      }
      return response;
    }

    // For unsafe methods, validate the token
    if (!csrfToken || !headerToken || csrfToken !== headerToken) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid CSRF token' }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/api/:path*',
  ],
}; 