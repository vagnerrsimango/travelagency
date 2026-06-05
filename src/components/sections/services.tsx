import Image from "next/image";

const services = [
  {
    icon: "/images/paths.svg",
    title: "Flight & Hotel Booking",
    desc: "Book domestic and international flights and hotels across Southern Africa with ease. We search hundreds of options to find you the best rates.",
    dark: true,
  },
  {
    icon: "/images/vip.svg",
    title: "Car Rentals",
    desc: "Explore Southern Africa at your own pace. From city sedans to 4x4 safari vehicles — we have the right car for every road.",
    dark: false,
  },
  {
    icon: "/images/safe.svg",
    title: "Secure Online Payments",
    desc: "Book and pay securely online through our trusted payment platform. Multiple currencies and payment methods accepted.",
    dark: false,
  },
  {
    icon: "/images/price.svg",
    title: "Promo Fares & Custom Itineraries",
    desc: "Enjoy exclusive promotional fares on top Southern Africa routes, plus custom itineraries crafted to match your style and budget.",
    dark: false,
  },
];

export function Services() {
  return (
    <div className="px-7 lg:px-28 pb-14 lg:pb-28 bg-lightbeige">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: heading + polaroid images */}
        <div>
          <h2 className="text-4xl md:text-5xl text-textdark">
            Everything You Need to <span className="italic">Travel Africa</span>
          </h2>
          <div className="pt-24 relative h-80 lg:h-96">
            {/* First polaroid — tilted */}
            <div className="rotate-[8deg]">
              <div className="absolute -top-5 left-24 bg-orange/60 h-10 w-32 z-50" />
              <div className="bg-shadow pr-2 pb-2 w-80 h-72 -mt-4 z-10">
                <div className="bg-white pt-10 px-6 pb-6 w-full h-full">
                  <Image
                    src="/images/explore1.jpg"
                    alt="Travel"
                    width={600}
                    height={600}
                    className="object-center object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
            {/* Second polaroid */}
            <div className="absolute top-14 lg:top-auto lg:-bottom-52 right-6">
              <div className="absolute -top-9 left-24 bg-leafy/60 h-10 w-32 z-50" />
              <div className="bg-shadow pr-2 pb-2 w-80 h-72 -mt-4 z-10">
                <div className="bg-white pt-10 px-6 pb-6 w-full h-full">
                  <Image
                    src="/images/explore2.jpg"
                    alt="Travel"
                    width={600}
                    height={600}
                    className="object-center object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: 2x2 service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div
              key={s.title}
              className={`p-6 rounded-xl hover:scale-105 duration-500 transition-all border border-darkgray ${
                s.dark ? "bg-leafy" : "bg-white"
              }`}
            >
              <div className="bg-shadow w-12 h-12 p-3 rounded-full">
                <Image src={s.icon} alt={s.title} width={600} height={600} className="w-full h-full object-center object-cover" />
              </div>
              <h3 className={`text-2xl mt-8 mb-6 ${s.dark ? "text-white" : "text-textdark"}`}>
                {s.title}
              </h3>
              <p className={s.dark ? "text-white/80" : "text-parablack"}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
