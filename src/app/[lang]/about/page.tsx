import { Suspense } from "react";
import type { Metadata } from "next";
import { Shell } from "@/components/layout/shell";
import { About } from "@/components/sections/about";
import { Services, type ServiceCard } from "@/components/sections/services";
import { SectionSkeleton } from "@/components/ui/skeleton";
import { getLocalizedDictionary } from "@/i18n/server";
import { ServiceService } from "@/lib/data-access/services";
import type { Locale } from "@/i18n/config";
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

  return dict.metadata.about;
}

async function ServicesSection({ locale, copy }: { locale: Locale; copy: Dictionary["sections"]["services"] }) {
  const services = await ServiceService.findAll({ status: "PUBLISHED" });
  const serviceCards: ServiceCard[] = services.map((s) => ({
    icon: s.icon || "/images/paths.svg",
    title: locale === "pt" ? s.namePt : s.nameEn,
    description: locale === "pt" ? s.descriptionPt : s.descriptionEn,
  }));

  if (serviceCards.length === 0) return null;
  return <Services copy={copy} services={serviceCards} />;
}

export default async function AboutPage({ params }: LocalePageProps) {
  const { lang } = await params;
  const { locale, dict } = getLocalizedDictionary(lang);
  const page = dict.pages.about;

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
      <About copy={dict.sections.about} />
      <Suspense
        fallback={
          <SectionSkeleton
            title={dict.sections.services.title}
            titleAccent={dict.sections.services.titleAccent}
            bgClassName="bg-lightbeige"
          />
        }
      >
        <ServicesSection locale={locale} copy={dict.sections.services} />
      </Suspense>
    </Shell>
  );
}
