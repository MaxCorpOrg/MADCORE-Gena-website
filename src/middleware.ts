import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthorizationValid } from "@/lib/admin-auth";

function unauthorizedResponse() {
  return new NextResponse("Требуется авторизация", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="MADCORE Admin", charset="UTF-8"',
    },
  });
}

export function middleware(request: NextRequest) {
  if (isAdminAuthorizationValid(request.headers.get("authorization"))) {
    return NextResponse.next();
  }

  return unauthorizedResponse();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
