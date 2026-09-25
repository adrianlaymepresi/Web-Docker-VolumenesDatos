import { NextResponse, type NextRequest } from "next/server";
import { HOME_ROUTE, LOGIN_ROUTE } from "@/config/navigation";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/features/auth/session-token";

export async function proxy(request: NextRequest) {
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE_NAME)?.value);
  const isLoginRoute = request.nextUrl.pathname === LOGIN_ROUTE;

  if (!session && !isLoginRoute) {
    return NextResponse.redirect(new URL(LOGIN_ROUTE, request.nextUrl));
  }
  if (session && isLoginRoute) {
    return NextResponse.redirect(new URL(HOME_ROUTE, request.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
