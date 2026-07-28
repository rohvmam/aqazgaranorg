import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intl = createIntlMiddleware(routing);

const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

const DASHBOARD_RE = new RegExp(
  `^/(${routing.locales.join("|")})/dashboard(/.*)?$`,
);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Fast cookie-presence gate for the dashboard; the dashboard layout
  // re-validates the session server-side with auth().
  const dashboardMatch = pathname.match(DASHBOARD_RE);
  if (dashboardMatch) {
    const hasSession = SESSION_COOKIES.some((name) =>
      request.cookies.has(name),
    );
    if (!hasSession) {
      const locale = dashboardMatch[1];
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intl(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
