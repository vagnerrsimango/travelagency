import { Suspense } from "react";
import type { Metadata } from "next";
import { Shell } from "@/components/layout/shell";
import { Booking } from "@/components/sections/booking";
import { Cars, type CarCard } from "@/components/sections/cars";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { getLocalizedDictionary } from "@/i18n/server";
import { VehicleService } from "@/lib/data-access/vehicles";
import type { Dictionary } from "@/i18n/types";

// Reads live catalog data — must not be statically prerendered at build
// time (see the identical note on the destinations page).
export const dynamic = "force-dynamic";

type LocalePageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { lang } = await params;
  const { dict } = getLocalizedDictionary(lang);

  return dict.metadata.cars;
}

async function CarsSection({ copy }: { copy: Dictionary["sections"]["cars"] }) {
  const vehicles = await VehicleService.findAll({ status: "PUBLISHED" });
  const carCards: CarCard[] = vehicles.map((v) => ({
    category: v.category,
    brand: v.model,
    type: v.type || v.category,
    seats: v.seats,
    luggage: v.luggage ?? 0,
    transmission: v.transmission || "Manual",
    pricePerDay: Number(v.pricePerDay),
    currency: v.currency,
    image: v.images[0] || "/images/safari1.jpg",
  }));

  if (carCards.length === 0) return null;
  return <Cars copy={copy} cars={carCards} />;
}

export default async function CarsPage({ params }: LocalePageProps) {
  const { lang } = await params;
  const { locale, dict } = getLocalizedDictionary(lang);
  const page = dict.pages.cars;

  return (
    <Shell locale={locale} copy={dict.layout}>
      <div className="bg-leafy px-7 lg:px-28 pt-36 pb-14">
        <h1 className="text-4xl md:text-6xl text-white leading-tight">
          {page.title} <span className="italic">{page.titleAccent}</span>
        </h1>
        <p className="text-white/60 mt-4 max-w-xl text-lg">
          {page.description}
        </p>
      </div>
      <Suspense
        fallback={
          <SectionSkeleton
            eyebrow={dict.sections.cars.eyebrow}
            title={dict.sections.cars.title}
            titleAccent={dict.sections.cars.titleAccent}
            description={dict.sections.cars.description}
            bgClassName="bg-beige"
          />
        }
      >
        <CarsSection copy={dict.sections.cars} />
      </Suspense>
      <Booking copy={dict.sections.booking} />
    </Shell>
  );
}
