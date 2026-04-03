import ipRangeCheck from 'ip-range-check';
import { NextResponse } from 'next/server';

const blockedIpRanges = ['66.249.65.0/255'];

export function middleware(req) {
  const clientIp = req.ip || req.headers.get('x-forwarded-for') || req.connection?.remoteAddress;

  const isBlocked = blockedIpRanges.some((range) => ipRangeCheck(clientIp, range));

  if (isBlocked) {
    return new NextResponse('Access denied', { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // Apply middleware to all routes
};
