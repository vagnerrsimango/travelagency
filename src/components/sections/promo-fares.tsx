import Link from "next/link";
import { AnimateIn } from "@/components/ui/animate-in";

const fares = [
  {
    from: "Maputo",
    to: "Johannesburg",
    highlight: "Daily departures — 1h flight",
    price: "89",
    currency: "USD",
    validity: "Valid until 30 Jun 2026",
    badge: "HOT DEAL",
    badgeClass: "badge-shimmer",
  },
  {
    from: "Maputo",
    to: "Lisbon",
    highlight: "Direct route — 11h flight",
    price: "890",
    currency: "USD",
    validity: "Valid until 31 Jul 2026",
    badge: "INTERNATIONAL",
    badgeClass: "bg-white/20",
  },
  {
    from: "Maputo",
    to: "Dubai",
    highlight: "Stopover packages available",
    price: "650",
    currency: "USD",
    validity: "Valid until 15 Aug 2026",
    badge: "POPULAR",
    badgeClass: "bg-white/20",
  },
  {
    from: "Maputo",
    to: "Cape Town",
    highlight: "Weekend getaway special",
    price: "220",
    currency: "USD",
    validity: "Valid until 30 Jun 2026",
    badge: "WEEKEND",
    badgeClass: "bg-white/20",
  },
];

export function PromoFares() {
  return (
    <div className="bg-leafy px-7 lg:px-28 py-14 lg:py-28 overflow-hidden">
      {/* Header */}
      <AnimateIn className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
        <div>
          <p className="text-orange text-sm uppercase tracking-widest mb-3">Limited Time Offers</p>
          <h2 className="text-4xl md:text-5xl text-white">
            Promotional <span className="italic">Fares</span>
          </h2>
          <p className="text-white/60 text-lg mt-4 max-w-md">
            Exclusive discounted routes from Maputo. Book before validity expires.
          </p>
        </div>
        <button
          type="button"
          className="border border-white/30 text-white hover:bg-white hover:text-leafy transition-all duration-300 rounded-3xl px-6 py-3 uppercase text-sm shrink-0 cursor-pointer"
        >
          View All Fares
        </button>
      </AnimateIn>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {fares.map((fare, i) => (
          <AnimateIn key={`${fare.from}-${fare.to}`} delay={i * 100}>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 flex flex-col gap-4 hover:bg-white/15 hover:-translate-y-1 transition-all duration-300 group overflow-hidden h-full">

              {/* Live indicator */}
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-live-pulse shrink-0" />
                <span className="text-green-400/80 text-[10px] uppercase tracking-widest font-medium">Live Offer</span>
              </div>

              {/* Badge */}
              <div className={`${fare.badgeClass} text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit`}>
                {fare.badge}
              </div>

              {/* Route */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="min-w-0 flex-1">
                  <p className="text-white/40 text-[10px] uppercase tracking-widest">From</p>
                  <p className="text-white font-semibold text-sm leading-tight truncate">{fare.from}</p>
                </div>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-orange shrink-0">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                </svg>
                <div className="min-w-0 flex-1 text-right">
                  <p className="text-white/40 text-[10px] uppercase tracking-widest">To</p>
                  <p className="text-white font-semibold text-sm leading-tight truncate">{fare.to}</p>
                </div>
              </div>

              {/* Highlight */}
              <p className="text-white/60 text-xs leading-relaxed">{fare.highlight}</p>

              {/* Price */}
              <div className="mt-auto pt-1">
                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Starting from</p>
                <p className="text-orange text-2xl font-bold leading-tight">
                  {fare.currency} {fare.price}
                </p>
                <p className="text-white/40 text-xs mt-0.5">per person</p>
              </div>

              {/* Validity */}
              <p className="text-white/35 text-[10px] border-t border-white/10 pt-3">{fare.validity}</p>

              <Link
                href="/book"
                className="bg-orange hover:bg-orange/90 text-white rounded-3xl px-5 py-2.5 text-xs font-semibold uppercase transition-all duration-300 w-full text-center block group-hover:shadow-lg"
              >
                Book This Fare
              </Link>
            </div>
          </AnimateIn>
        ))}
      </div>
    </div>
  );
}
