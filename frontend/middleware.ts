import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/applications', '/profile'];
const adminRoutes = ['/admin'];

export function middleware(request: NextRequest) {
  // Using access_token since we have cookies from the backend, 
  // or checking for firebase-token if set by client.
  const token = request.cookies.get('firebase-token') || request.cookies.get('access_token');
  
  if (protectedRoutes.some(r => request.nextUrl.pathname.startsWith(r)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}
