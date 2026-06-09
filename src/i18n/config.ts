export const locales = ["en", "pt"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeOptions: Record<
  Locale,
  {
    label: string;
    shortLabel: string;
    flag: string;
  }
> = {
  en: {
    label: "English",
    shortLabel: "EN",
    flag: "🇬🇧",
  },
  pt: {
    label: "Português",
    shortLabel: "PT",
    flag: "🇲🇿",
  },
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localizedPath(locale: Locale, path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return normalizedPath === "/" ? `/${locale}` : `/${locale}${normalizedPath}`;
}

export function stripLocaleFromPath(pathname: string) {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (!isLocale(maybeLocale)) {
    return pathname || "/";
  }

  const pathWithoutLocale = `/${segments.slice(2).join("/")}`;

  return pathWithoutLocale === "/" ? "/" : pathWithoutLocale.replace(/\/$/, "");
}

export function getLocalizedPathname(pathname: string, locale: Locale) {
  return localizedPath(locale, stripLocaleFromPath(pathname));
}
