import type { Metadata } from "next";
import { Shell } from "@/components/layout/shell";
import { About } from "@/components/sections/about";
import { Essencia } from "@/components/sections/essencia";
import { MissionValues } from "@/components/sections/mission-values";
import { FullServices } from "@/components/sections/full-services";
import { WhyUs } from "@/components/sections/why-us";
import { HowWeWork } from "@/components/sections/how-we-work";
import { WhoWeServe } from "@/components/sections/who-we-serve";
import { getLocalizedDictionary } from "@/i18n/server";

// This page's content is static (translated straight from the corporate
// profile PDF) — no live catalog reads here any more, so it doesn't need
// force-dynamic like the pages that show real hotel/car/package data.

type LocalePageProps = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { lang } = await params;
  const { dict } = getLocalizedDictionary(lang);

  return dict.metadata.about;
}

export default async function AboutPage({ params }: LocalePageProps) {
  const { lang } = await params;
  const { locale, dict } = getLocalizedDictionary(lang);
  const page = dict.pages.about;

  return (
    <Shell locale={locale} copy={dict.layout}>
      <div className="bg-leafy px-7 lg:px-28 pt-36 pb-14">
        <p className="text-orange text-xs uppercase tracking-[0.25em] font-semibold mb-3">{page.slogan}</p>
        <h1 className="text-4xl md:text-6xl text-white leading-tight">
          {page.title} <span className="italic">{page.titleAccent}</span>
        </h1>
        <p className="text-white/60 mt-4 max-w-xl text-lg">
          {page.description}
        </p>
      </div>
      <About copy={dict.sections.about} />
      <Essencia copy={dict.sections.essencia} />
      <MissionValues copy={dict.sections.missionValues} />
      <FullServices locale={locale} copy={dict.sections.fullServices} />
      <WhyUs copy={dict.sections.whyUs} />
      <HowWeWork copy={dict.sections.howWeWork} />
      <WhoWeServe copy={dict.sections.whoWeServe} />
    </Shell>
  );
}
