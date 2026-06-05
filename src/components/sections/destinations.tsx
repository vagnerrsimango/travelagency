"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

const destinations = [
  { name: "Zambia", label: "4 National Parks", image: "/images/safari1.jpg" },
  { name: "Zimbabwe", label: "Victoria Falls", image: "/images/safari2.jpg" },
  { name: "South Africa", label: "5 World Wonders", image: "/images/Switzerland.jpg" },
  { name: "Mozambique", label: "3 Island Escapes", image: "/images/Maldives.jpg" },
  { name: "Botswana", label: "Okavango Delta", image: "/images/Brazil.jpg" },
  { name: "Tanzania", label: "Serengeti Safari", image: "/images/safari2.jpg" },
  { name: "Namibia", label: "Desert Landscapes", image: "/images/Iceland.jpg" },
  { name: "Kenya", label: "5 National Parks", image: "/images/India.jpg" },
];

export function Destinations() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", slidesToScroll: 1 });

  return (
    <div className="px-7 lg:px-28 py-14 lg:py-28 bg-beige md:pt-36 lg:pt-44 md:rounded-t-[44%] relative mt-28 lg:mt-44">
      {/* Quote */}
      <div className="text-center mb-14 lg:mb-28">
        <p className="text-3xl md:text-5xl text-textdark max-w-4xl mx-auto leading-tight italic font-light">
          &ldquo;Travel is not just about the places you go, but the experiences that transform you along the way.&rdquo;
        </p>
      </div>

      {/* Section header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h2 className="text-4xl md:text-5xl text-textdark">
            Our <span className="italic">Exclusive</span> Destinations
          </h2>
          <p className="text-parablack text-lg mt-4 max-w-xl">
            Discover a world of unparalleled beauty and charm with our handpicked selection of exclusive destinations.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="w-10 h-10 rounded-full border border-textdark flex items-center justify-center hover:bg-textdark hover:text-white transition-all duration-300"
            aria-label="Previous"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="w-10 h-10 rounded-full border border-textdark flex items-center justify-center hover:bg-textdark hover:text-white transition-all duration-300"
            aria-label="Next"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex gap-4">
          {destinations.map((d) => (
            <div
              key={d.name}
              className="embla__slide embla__slide--dest shrink-0"
            >
              <div className="relative h-72 rounded-xl overflow-hidden group cursor-pointer">
                <Image
                  src={d.image}
                  alt={d.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-orange" />
                    <span className="text-sm text-white/80">{d.name}</span>
                  </div>
                  <p className="text-2xl font-semibold">{d.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
