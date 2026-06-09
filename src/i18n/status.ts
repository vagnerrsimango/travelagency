import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

const statusCopy = {
  en: {
    notFound: {
      code: "404",
      title: "Page not found",
      description: "The trip you are looking for is not available here.",
      returnHome: "Return home",
    },
    error: {
      title: "Something went wrong",
      description: "We could not load this page. Try again in a moment.",
      tryAgain: "Try again",
    },
    loading: "Loading...",
  },
  pt: {
    notFound: {
      code: "404",
      title: "Página não encontrada",
      description: "A viagem que procura não está disponível aqui.",
      returnHome: "Voltar ao início",
    },
    error: {
      title: "Algo correu mal",
      description: "Não conseguimos carregar esta página. Tente novamente dentro de instantes.",
      tryAgain: "Tentar novamente",
    },
    loading: "A carregar...",
  },
} satisfies Record<Locale, object>;

export function getLocaleFromPathname(pathname: string) {
  const maybeLocale = pathname.split("/")[1];

  return isLocale(maybeLocale) ? maybeLocale : defaultLocale;
}

export function getStatusCopy(locale: Locale) {
  return statusCopy[locale];
}
