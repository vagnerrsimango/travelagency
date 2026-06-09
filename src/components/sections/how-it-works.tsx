import { AnimateIn } from "@/components/ui/animate-in";
import type { Dictionary } from "@/i18n/types";

type HowItWorksProps = {
  copy: Dictionary["home"]["howItWorks"];
};

export function HowItWorks({ copy }: HowItWorksProps) {
  return (
    <div className="bg-leafy px-7 lg:px-28 py-14 lg:py-28">
      <AnimateIn className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl text-white">
          {copy.title} <span className="italic">{copy.titleAccent}</span>
        </h2>
        <p className="text-white/70 text-lg mt-4 max-w-xl mx-auto">
          {copy.description}
        </p>
      </AnimateIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {/* Connecting line - desktop only */}
        <div className="absolute top-10 left-[12.5%] right-[12.5%] h-px bg-white/20 hidden lg:block" />

        {copy.steps.map((step, i) => (
          <AnimateIn key={step.number} delay={i * 120} className="flex flex-col items-center text-center gap-4 relative">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold z-10 border-2 transition-all duration-300 ${
                i === 0
                  ? "bg-orange border-orange text-white"
                  : "bg-leafy border-white/40 text-white hover:border-orange hover:text-orange"
              }`}
            >
              {step.number}
            </div>
            <h3 className="text-xl text-white">{step.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{step.description}</p>
          </AnimateIn>
        ))}
      </div>
    </div>
  );
}
