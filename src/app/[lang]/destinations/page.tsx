import type { Metadata } from "next";
import { Shell } from "@/components/layout/shell";
import { Destinations } from "@/components/sections/destinations";
import { Packages } from "@/components/sections/packages";
import { Tours } from "@/components/sections/tours";
import { getLocalizedDictionary } from "@/i18n/server";

type LocalePageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { lang } = await params;
  const { dict } = getLocalizedDictionary(lang);

  return dict.metadata.destinations;
}

export default async function DestinationsPage({ params }: LocalePageProps) {
  const { lang } = await params;
  const { locale, dict } = getLocalizedDictionary(lang);
  const page = dict.pages.destinations;

  return (
    <Shell locale={locale} copy={dict.layout}>
      <div className="bg-leafy px-7 lg:px-28 pt-36 pb-0">
        <h1 className="text-4xl md:text-6xl text-white leading-tight">
          {page.title} <span className="italic">{page.titleAccent}</span>
        </h1>
        <p className="text-white/60 mt-4 max-w-xl text-lg pb-14">
          {page.description}
        </p>
      </div>
      <Destinations copy={dict.sections.destinations} />
      <Tours copy={dict.sections.tours} />
      <Packages copy={dict.sections.packages} />
    </Shell>
  );
}
