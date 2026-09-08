import type { Dictionary } from "@/i18n/types";

type WhoWeServeProps = {
  copy: Dictionary["sections"]["whoWeServe"];
};

export function WhoWeServe({ copy }: WhoWeServeProps) {
  return (
    <div className="px-7 lg:px-28 py-14 lg:py-28 bg-beige">
      <div className="text-center mb-14">
        <p className="text-orange text-sm uppercase tracking-widest mb-3">{copy.eyebrow}</p>
        <h2 className="text-4xl md:text-5xl text-textdark">
          {copy.title} <span className="italic">{copy.titleAccent}</span>
        </h2>
        <p className="text-parablack text-lg mt-4 max-w-xl mx-auto">{copy.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
        {copy.segments.map((segment) => (
          <div key={segment.title} className="bg-white rounded-2xl border border-darkgray/20 p-7">
            <h3 className="text-lg text-textdark mb-2">{segment.title}</h3>
            <p className="text-parablack text-sm leading-relaxed">{segment.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-leafy rounded-2xl p-7 max-w-3xl mx-auto flex items-center gap-5">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9 text-orange shrink-0">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
        <p className="text-white text-sm md:text-base leading-relaxed">{copy.callout}</p>
      </div>
    </div>
  );
}
