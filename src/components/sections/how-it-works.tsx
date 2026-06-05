import { AnimateIn } from "@/components/ui/animate-in";

const steps = [
  {
    number: "01",
    title: "Choose Your Service",
    desc: "Select flights, hotels, car rentals or a complete travel package tailored to your destination.",
  },
  {
    number: "02",
    title: "Send Your Request",
    desc: "Fill in our reservation form with your travel dates, preferences and passenger details.",
  },
  {
    number: "03",
    title: "Receive Confirmation",
    desc: "Our team reviews your request and sends a detailed quote and booking confirmation within 24h.",
  },
  {
    number: "04",
    title: "Pay & Prepare",
    desc: "Confirm your booking with a secure payment via M-Pesa, card or bank transfer. Then pack your bags.",
  },
];

export function HowItWorks() {
  return (
    <div className="bg-leafy px-7 lg:px-28 py-14 lg:py-28">
      <AnimateIn className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl text-white">
          How It <span className="italic">Works</span>
        </h2>
        <p className="text-white/70 text-lg mt-4 max-w-xl mx-auto">
          Booking your next Southern Africa adventure is simple. Four steps and you are ready to go.
        </p>
      </AnimateIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
        {/* Connecting line — desktop only */}
        <div className="absolute top-10 left-[12.5%] right-[12.5%] h-px bg-white/20 hidden lg:block" />

        {steps.map((step, i) => (
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
            <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
          </AnimateIn>
        ))}
      </div>
    </div>
  );
}
