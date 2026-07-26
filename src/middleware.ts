import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');
  const isHomePage = request.nextUrl.pathname === '/';
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');
  const isOnboardingPage = request.nextUrl.pathname.startsWith('/onboarding');
  const isExpiredPage = request.nextUrl.pathname.startsWith('/expired');

  const isDashboardExpired = request.nextUrl.pathname === '/dashboard/expired';

  if (isDashboardExpired) {
    return NextResponse.redirect(new URL('/expired', request.url));
  }

  if (!token) {
    if (isDashboardPage || isOnboardingPage || isExpiredPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // The user is logged in
  const hasTenant = !!token.tenantId;

  if (isAuthPage || isHomePage) {
    if (hasTenant) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  if ((isDashboardPage || isExpiredPage) && !hasTenant) {
    // If they try to access dashboard without a tenant (company), force onboarding
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  if (isOnboardingPage && hasTenant) {
    // If they already have a tenant, they shouldn't see the onboarding page
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/expired/:path*',
    '/login',
    '/register'
  ],
};
