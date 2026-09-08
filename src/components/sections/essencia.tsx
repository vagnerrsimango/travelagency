import type { Dictionary } from "@/i18n/types";

type EssenciaProps = {
  copy: Dictionary["sections"]["essencia"];
};

export function Essencia({ copy }: EssenciaProps) {
  return (
    <div className="px-7 lg:px-28 py-14 lg:py-28 bg-lightbeige">
      <div className="text-center mb-14">
        <p className="text-orange text-sm uppercase tracking-widest mb-3">{copy.eyebrow}</p>
        <h2 className="text-4xl md:text-5xl text-textdark">
          {copy.title} <span className="italic">{copy.titleAccent}</span>
        </h2>
        <p className="text-parablack text-lg mt-4 max-w-xl mx-auto">{copy.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
        {copy.pillars.map((pillar) => (
          <div key={pillar.title} className="text-center md:text-left">
            <h3 className="text-2xl text-textdark mb-3">{pillar.title}</h3>
            <div className="w-10 h-0.5 bg-orange mb-4 mx-auto md:mx-0" />
            <p className="text-parablack text-sm leading-relaxed">{pillar.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 bg-leafy rounded-2xl px-8 py-8 max-w-3xl mx-auto text-center">
        <p className="text-orange text-xs uppercase tracking-widest mb-3">{copy.calloutLabel}</p>
        <p className="text-white text-lg leading-relaxed">{copy.callout}</p>
      </div>
    </div>
  );
}
