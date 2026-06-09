import { Shell } from "@/components/layout/shell";
import { BookingOptions } from "@/components/sections/booking-options";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PromoFares } from "@/components/sections/promo-fares";
import { getLocalizedDictionary } from "@/i18n/server";

type LocalePageProps = {
  params: Promise<{ lang: string }>;
};

export default async function Home({ params }: LocalePageProps) {
  const { lang } = await params;
  const { locale, dict } = getLocalizedDictionary(lang);

  return (
    <Shell locale={locale} copy={dict.layout}>
      <Hero locale={locale} copy={dict.home.hero} />
      <BookingOptions locale={locale} copy={dict.home.bookingOptions} />
      <PromoFares locale={locale} copy={dict.home.promoFares} />
      <HowItWorks copy={dict.home.howItWorks} />
    </Shell>
  );
}
