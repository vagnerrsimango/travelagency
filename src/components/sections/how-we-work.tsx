import type { Dictionary } from "@/i18n/types";

type HowWeWorkProps = {
  copy: Dictionary["sections"]["howWeWork"];
};

export function HowWeWork({ copy }: HowWeWorkProps) {
  return (
    <div className="px-7 lg:px-28 py-14 lg:py-28 bg-lightbeige">
      <div className="text-center mb-14">
        <p className="text-orange text-sm uppercase tracking-widest mb-3">{copy.eyebrow}</p>
        <h2 className="text-4xl md:text-5xl text-textdark">
          {copy.title} <span className="italic">{copy.titleAccent}</span>
        </h2>
        <p className="text-parablack text-lg mt-4 max-w-xl mx-auto">{copy.description}</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {copy.steps.map((step, i) => (
          <div key={step.title} className="flex gap-5">
            <div className="flex flex-col items-center">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                  i % 2 === 0 ? "bg-orange text-white" : "bg-leafy text-white"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              {i < copy.steps.length - 1 && <div className="w-px flex-1 bg-darkgray/30 my-1" />}
            </div>
            <div className="pb-8">
              <h3 className="text-lg text-textdark mb-1">{step.title}</h3>
              <p className="text-parablack text-sm leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-orange/10 border border-orange/30 rounded-xl p-6 max-w-2xl mx-auto flex items-start gap-4">
        <div className="bg-orange text-white text-xs font-bold px-3 py-1.5 rounded-full shrink-0">
          {copy.calloutLabel}
        </div>
        <p className="text-parablack text-sm leading-relaxed">{copy.callout}</p>
      </div>
    </div>
  );
}
