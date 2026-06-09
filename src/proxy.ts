import { NextResponse, type NextRequest } from "next/server";

const locales = ["en", "pt"] as const;
const defaultLocale = "en";
const localeCookie = "NEXT_LOCALE";

function isLocale(value: string): value is (typeof locales)[number] {
  return locales.includes(value as (typeof locales)[number]);
}

function getPreferredLocale(request: NextRequest) {
  const savedLocale = request.cookies.get(localeCookie)?.value;

  if (savedLocale && isLocale(savedLocale)) {
    return savedLocale;
  }

  const acceptedLanguage = request.headers.get("accept-language")?.toLowerCase() ?? "";

  return acceptedLanguage.includes("pt") ? "pt" : defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set(localeCookie, locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
