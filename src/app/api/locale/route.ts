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
  // Relative Location: request.url reflects the internal bind address
  // (localhost) behind a reverse proxy, which sent users to localhost in prod.
  const response = new NextResponse(null, { status: 307, headers: { Location: nextPath } });

  response.cookies.set(localeCookie, nextLocale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
