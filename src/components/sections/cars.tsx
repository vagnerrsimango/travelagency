import Image from "next/image";

const SeatIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-darkgray">
    <path d="M5 6c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm13 12H6v-1l2-2v-3c0-1.3.84-2.4 2-2.82V9h2v.18C13.16 9.6 14 10.7 14 12v3l2 2v1zm-2 2H8v-1h8v1z" />
  </svg>
);

const LuggageIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-darkgray">
    <path d="M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.54 15.96.5 13.5.5S9 2.54 9 4.66c0 .46.1.9.18 1.34H7C5.9 6 5 6.9 5 8v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8.34-1.34c0-1.02.82-1.84 1.84-1.84s1.84.82 1.84 1.84c0 .46-.1.9-.26 1.34h-3.16c-.16-.44-.26-.88-.26-1.34zM15 15H9v-2h6v2z" />
  </svg>
);

const GearIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-darkgray">
    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
  </svg>
);

interface Car {
  category: string;
  brand: string;
  pricePerDay: number;
  currency: string;
  seats: number;
  luggage: number;
  transmission: string;
  type: string;
  image: string;
}

const cars: Car[] = [
  {
    category: "Economy",
    brand: "Toyota Corolla or similar",
    pricePerDay: 35,
    currency: "USD",
    seats: 5,
    luggage: 1,
    transmission: "Manual",
    type: "Sedan",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
  },
  {
    category: "SUV",
    brand: "Toyota RAV4 or similar",
    pricePerDay: 75,
    currency: "USD",
    seats: 5,
    luggage: 2,
    transmission: "Automatic",
    type: "4x2 SUV",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
  },
  {
    category: "4x4 Safari",
    brand: "Toyota Land Cruiser or similar",
    pricePerDay: 120,
    currency: "USD",
    seats: 7,
    luggage: 3,
    transmission: "Manual / 4WD",
    type: "Off-Road",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
  },
  {
    category: "Minibus",
    brand: "Toyota HiAce or similar",
    pricePerDay: 90,
    currency: "USD",
    seats: 12,
    luggage: 4,
    transmission: "Manual",
    type: "Group Transfer",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
  },
];

export function Cars() {
  return (
    <div className="px-7 lg:px-28 py-14 lg:py-28 bg-beige">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <p className="text-orange text-sm uppercase tracking-widest mb-3">Mobility</p>
          <h2 className="text-4xl md:text-5xl text-textdark">
            Car Rental <span className="italic">Options</span>
          </h2>
          <p className="text-parablack text-lg mt-4 max-w-md">
            Choose the right vehicle for your journey — from city sedans to fully-equipped safari 4x4s.
          </p>
        </div>
        <button
          type="button"
          className="bg-orange/10 text-orange hover:bg-orange hover:text-white transition-all duration-300 rounded-3xl px-6 py-3 uppercase text-sm shrink-0 cursor-pointer"
        >
          See All Vehicles
        </button>
      </div>

      {/* Car cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cars.map((car) => (
          <div
            key={car.category}
            className="bg-white rounded-2xl border border-darkgray/20 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            {/* Car image */}
            <div className="relative h-44 overflow-hidden">
              <Image
                src={car.image}
                alt={car.category}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-xs font-semibold uppercase tracking-wider">{car.type}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col gap-4 flex-1">
              <div>
                <h3 className="text-xl text-textdark">{car.category}</h3>
                <p className="text-xs text-darkgray mt-1">{car.brand}</p>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-3 py-3 border-y border-shadow">
                <div className="flex flex-col items-center gap-1">
                  <SeatIcon />
                  <span className="text-xs text-parablack font-medium">{car.seats}</span>
                  <span className="text-xs text-darkgray">Seats</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <LuggageIcon />
                  <span className="text-xs text-parablack font-medium">{car.luggage}</span>
                  <span className="text-xs text-darkgray">Bags</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <GearIcon />
                  <span className="text-xs text-parablack font-medium text-center leading-tight">{car.transmission.split(" ")[0]}</span>
                  <span className="text-xs text-darkgray">Gearbox</span>
                </div>
              </div>

              {/* Price + CTA */}
              <div className="flex items-center justify-between mt-auto">
                <div>
                  <p className="text-xs text-darkgray">From</p>
                  <p className="text-orange font-bold text-xl">
                    {car.currency} {car.pricePerDay}
                    <span className="text-darkgray text-xs font-normal">/day</span>
                  </p>
                </div>
                <button
                  type="button"
                  className="bg-orange hover:bg-orange/90 text-white rounded-3xl px-4 py-2 text-xs font-semibold uppercase cursor-pointer transition-all duration-300"
                >
                  Reserve Car
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
