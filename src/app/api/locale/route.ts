import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, localizedPath } from "@/i18n/config";

const localeCookie = "NEXT_LOCALE";

function getSafeRedirectPath(value: string | null, locale: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return localizedPath(isLocale(locale) ? locale : defaultLocale, "/");
  }

  return value;
}

export function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get("locale") ?? defaultLocale;
  const nextLocale = isLocale(locale) ? locale : defaultLocale;
  const nextPath = getSafeRedirectPath(request.nextUrl.searchParams.get("next"), nextLocale);
  const response = NextResponse.redirect(new URL(nextPath, request.url));

  response.cookies.set(localeCookie, nextLocale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
