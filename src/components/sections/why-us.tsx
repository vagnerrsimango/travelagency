import type { Dictionary } from "@/i18n/types";

type WhyUsProps = {
  copy: Dictionary["sections"]["whyUs"];
};

export function WhyUs({ copy }: WhyUsProps) {
  return (
    <div className="px-7 lg:px-28 py-14 lg:py-28 bg-beige">
      <div className="text-center mb-14">
        <p className="text-orange text-sm uppercase tracking-widest mb-3">{copy.eyebrow}</p>
        <h2 className="text-4xl md:text-5xl text-textdark">
          {copy.title} <span className="italic">{copy.titleAccent}</span>
        </h2>
        <p className="text-parablack text-lg mt-4 max-w-xl mx-auto">{copy.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 max-w-4xl mx-auto">
        {copy.items.map((item, i) => (
          <div key={item.title} className="flex items-start gap-5">
            <span className="text-5xl font-light text-darkgray/30 leading-none shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-lg text-textdark mb-1.5">{item.title}</h3>
              <p className="text-parablack text-sm leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center max-w-2xl mx-auto">
        <p className="text-textdark text-xl italic leading-relaxed">
          {copy.callout}
        </p>
      </div>
    </div>
  );
}
