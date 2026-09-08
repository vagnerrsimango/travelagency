import type { Dictionary } from "@/i18n/types";

type MissionValuesProps = {
  copy: Dictionary["sections"]["missionValues"];
};

export function MissionValues({ copy }: MissionValuesProps) {
  return (
    <div className="px-7 lg:px-28 py-14 lg:py-28 bg-beige">
      <div className="text-center mb-14">
        <p className="text-orange text-sm uppercase tracking-widest mb-3">{copy.eyebrow}</p>
        <h2 className="text-4xl md:text-5xl text-textdark">
          {copy.title} <span className="italic">{copy.titleAccent}</span>
        </h2>
        <p className="text-parablack text-lg mt-4 max-w-xl mx-auto">{copy.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-6">
        <div className="bg-white rounded-2xl border border-darkgray/20 p-8">
          <p className="text-orange text-xs uppercase tracking-widest mb-3">{copy.missionLabel}</p>
          <p className="text-textdark text-base leading-relaxed">{copy.mission}</p>
        </div>
        <div className="bg-white rounded-2xl border border-darkgray/20 p-8">
          <p className="text-orange text-xs uppercase tracking-widest mb-3">{copy.visionLabel}</p>
          <p className="text-textdark text-base leading-relaxed">{copy.vision}</p>
        </div>
      </div>

      <div className="bg-leafy rounded-2xl p-8 max-w-4xl mx-auto">
        <p className="text-orange text-xs uppercase tracking-widest mb-5">{copy.valuesLabel}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {copy.values.map((value) => (
            <div key={value} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rotate-45 bg-orange shrink-0" />
              <span className="text-white text-sm">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
