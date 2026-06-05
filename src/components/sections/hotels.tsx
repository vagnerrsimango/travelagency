import Image from "next/image";

const StarIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-yellow-400">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-orange shrink-0">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

interface Hotel {
  name: string;
  location: string;
  stars: number;
  priceFrom: number;
  currency: string;
  desc: string;
  amenities: string[];
  image: string;
}

const hotels: Hotel[] = [
  {
    name: "Polana Serena Hotel",
    location: "Maputo, Mozambique",
    stars: 5,
    priceFrom: 220,
    currency: "USD",
    desc: "Iconic colonial landmark with ocean views, infinity pool and award-winning dining.",
    amenities: ["Pool", "Spa", "Restaurant", "WiFi"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Baobab Beach Resort",
    location: "Vilankulo, Mozambique",
    stars: 4,
    priceFrom: 180,
    currency: "USD",
    desc: "Tropical beachfront resort with direct access to the pristine Bazaruto Archipelago.",
    amenities: ["Beach", "Water Sports", "Pool", "WiFi"],
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Victoria Falls Hotel",
    location: "Victoria Falls, Zimbabwe",
    stars: 5,
    priceFrom: 340,
    currency: "USD",
    desc: "The grande dame of African hotels, steps from the world's most spectacular waterfall.",
    amenities: ["Fine Dining", "Spa", "Pool", "WiFi"],
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sandton Sun Hotel",
    location: "Johannesburg, South Africa",
    stars: 4,
    priceFrom: 95,
    currency: "USD",
    desc: "Contemporary hotel in the heart of Sandton's financial and shopping district.",
    amenities: ["Gym", "Restaurant", "Business Centre", "WiFi"],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
  },
];

export function Hotels() {
  return (
    <div className="px-7 lg:px-28 py-14 lg:py-28 bg-lightbeige">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <p className="text-orange text-sm uppercase tracking-widest mb-3">Accommodation</p>
          <h2 className="text-4xl md:text-5xl text-textdark">
            Featured <span className="italic">Hotels</span>
          </h2>
          <p className="text-parablack text-lg mt-4 max-w-md">
            From beach resorts to city hotels — we partner with the best properties across Southern Africa.
          </p>
        </div>
        <button
          type="button"
          className="bg-orange/10 text-orange hover:bg-orange hover:text-white transition-all duration-300 rounded-3xl px-6 py-3 uppercase text-sm shrink-0 cursor-pointer"
        >
          Browse All Hotels
        </button>
      </div>

      {/* Hotel cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {hotels.map((hotel) => (
          <div
            key={hotel.name}
            className="bg-white rounded-2xl border border-darkgray/20 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
          >
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
              <Image
                src={hotel.image}
                alt={hotel.name}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover group-hover:scale-105 transition-all duration-500"
              />
              {/* Stars overlay */}
              <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col gap-3 flex-1">
              <div className="flex items-start gap-1">
                <LocationIcon />
                <p className="text-xs text-darkgray">{hotel.location}</p>
              </div>
              <h3 className="text-lg text-textdark leading-tight">{hotel.name}</h3>
              <p className="text-parablack text-xs leading-relaxed">{hotel.desc}</p>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {hotel.amenities.map((a) => (
                  <span key={a} className="bg-beige text-parablack text-xs px-2.5 py-1 rounded-full">
                    {a}
                  </span>
                ))}
              </div>

              {/* Price + CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-shadow mt-2">
                <div>
                  <p className="text-xs text-darkgray">From</p>
                  <p className="text-orange font-bold text-lg">
                    {hotel.currency} {hotel.priceFrom}
                    <span className="text-darkgray text-xs font-normal">/night</span>
                  </p>
                </div>
                <button
                  type="button"
                  className="bg-orange hover:bg-orange/90 text-white rounded-3xl px-4 py-2 text-xs font-semibold uppercase cursor-pointer transition-all duration-300"
                >
                  Check Availability
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
