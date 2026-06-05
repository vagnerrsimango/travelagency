import Link from "next/link";
import { AnimateIn } from "@/components/ui/animate-in";

const FlightIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const HotelIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
  </svg>
);

const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </svg>
);

const options = [
  {
    id: "flights",
    title: "Flights",
    desc: "Best fares on domestic and international routes across Southern Africa and beyond. Daily departures from Maputo.",
    cta: "Search Flights",
    href: "/book",
    Icon: FlightIcon,
  },
  {
    id: "hotels",
    title: "Hotels",
    desc: "Handpicked hotels, lodges and beach resorts at every price point — from guesthouses to five-star properties.",
    cta: "Browse Hotels",
    href: "/hotels",
    Icon: HotelIcon,
  },
  {
    id: "cars",
    title: "Car Rentals",
    desc: "City sedans, 4x4 safari vehicles and minibuses available. Explore Southern Africa at your own pace.",
    cta: "Rent a Car",
    href: "/cars",
    Icon: CarIcon,
  },
];

export function BookingOptions() {
  return (
    <div className="px-7 lg:px-28 py-14 lg:py-28 bg-beige">
      <AnimateIn className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl text-textdark">
          What Are You <span className="italic">Looking For?</span>
        </h2>
        <p className="text-parablack text-lg mt-4 max-w-xl mx-auto">
          Select your travel need and let ZambiTour handle everything — from the first search to boarding.
        </p>
      </AnimateIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {options.map((opt, i) => (
          <AnimateIn key={opt.id} delay={i * 120}>
            <div className="bg-white border border-darkgray/30 rounded-2xl p-8 flex flex-col gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group h-full">
              <div className="w-16 h-16 rounded-full bg-beige group-hover:bg-orange/10 flex items-center justify-center text-orange transition-colors duration-300">
                <opt.Icon />
              </div>
              <div>
                <h3 className="text-2xl text-textdark mb-3">{opt.title}</h3>
                <p className="text-parablack leading-relaxed text-sm">{opt.desc}</p>
              </div>
              <Link
                href={opt.href}
                className="mt-auto bg-orange/10 text-orange hover:bg-orange hover:text-white transition-all duration-300 rounded-3xl px-6 py-3 text-sm font-semibold uppercase w-fit"
              >
                {opt.cta}
              </Link>
            </div>
          </AnimateIn>
        ))}
      </div>
    </div>
  );
}
