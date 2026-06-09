import type { Metadata } from "next";
import { Shell } from "@/components/layout/shell";
import { Booking } from "@/components/sections/booking";
import { Hotels } from "@/components/sections/hotels";
import { getLocalizedDictionary } from "@/i18n/server";

type LocalePageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { lang } = await params;
  const { dict } = getLocalizedDictionary(lang);

  return dict.metadata.hotels;
}

export default async function HotelsPage({ params }: LocalePageProps) {
  const { lang } = await params;
  const { locale, dict } = getLocalizedDictionary(lang);
  const page = dict.pages.hotels;

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
      <Hotels copy={dict.sections.hotels} />
      <Booking copy={dict.sections.booking} />
    </Shell>
  );
}
