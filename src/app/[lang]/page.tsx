import { Suspense } from "react";
import { Shell } from "@/components/layout/shell";
import { BookingOptions } from "@/components/sections/booking-options";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PromoFares, type FareCard } from "@/components/sections/promo-fares";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { getLocalizedDictionary } from "@/i18n/server";
import { PromoFareService } from "@/lib/data-access/promo-fares";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";

// Reads live catalog data — must not be statically prerendered at build
// time (see the identical note on the destinations page).
export const dynamic = "force-dynamic";

type LocalePageProps = {
  params: Promise<{ lang: string }>;
};

async function PromoFaresSection({ locale, copy }: { locale: Locale; copy: Dictionary["home"]["promoFares"] }) {
  const promoFares = await PromoFareService.findAll({ status: "PUBLISHED" });
  // findAll's query already restricts to flightOfferId != null, but Prisma's
  // types can't express that from the where-clause — narrow it here too.
  const activeFares = promoFares.filter(
    (f): f is typeof f & { flightOffer: NonNullable<typeof f.flightOffer> } =>
      f.flightOffer !== null && f.active && f.startsAt <= new Date() && f.endsAt >= new Date()
  );
  const fareCards: FareCard[] = activeFares.map((f) => ({
    from: f.flightOffer.origin,
    to: f.flightOffer.destinationLabel,
    highlight: (locale === "pt" ? f.highlightPt : f.highlightEn) || "",
    price: Number(f.promoPrice).toLocaleString(locale === "pt" ? "pt-PT" : "en-US"),
    currency: f.currency,
    validity:
      (locale === "pt" ? "Válido até " : "Valid until ") +
      f.endsAt.toLocaleDateString(locale === "pt" ? "pt-PT" : "en-US", { day: "numeric", month: "short", year: "numeric" }),
    badge: locale === "pt" ? f.labelPt : f.labelEn,
    featured: f.featured,
  }));

  if (fareCards.length === 0) return null;
  return <PromoFares locale={locale} copy={copy} fares={fareCards} />;
}

export default async function Home({ params }: LocalePageProps) {
  const { lang } = await params;
  const { locale, dict } = getLocalizedDictionary(lang);

  return (
    <Shell locale={locale} copy={dict.layout}>
      <Hero locale={locale} copy={dict.home.hero} />
      <BookingOptions locale={locale} copy={dict.home.bookingOptions} />
      <Suspense
        fallback={
          <SectionSkeleton
            eyebrow={dict.home.promoFares.eyebrow}
            title={dict.home.promoFares.title}
            titleAccent={dict.home.promoFares.titleAccent}
            description={dict.home.promoFares.description}
            bgClassName="bg-leafy"
            titleClassName="text-white"
            descriptionClassName="text-white/60"
          />
        }
      >
        <PromoFaresSection locale={locale} copy={dict.home.promoFares} />
      </Suspense>
      <HowItWorks copy={dict.home.howItWorks} />
    </Shell>
  );
}
