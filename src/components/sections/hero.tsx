"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Tab = "flight" | "hotel" | "car";

const cities = [
  "Maputo", "Beira", "Nampula", "Pemba",
  "Johannesburg", "Cape Town", "Durban",
  "Harare", "Victoria Falls",
  "Lusaka", "Livingstone",
  "Nairobi", "Zanzibar", "Dar es Salaam",
  "Dubai", "Lisbon", "London",
];

const PlaneIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const BedIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
    <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
  </svg>
);

const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-orange/70 shrink-0">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

type TabItem = { id: Tab; label: string; Icon: () => React.ReactElement };

const tabItems: TabItem[] = [
  { id: "flight", label: "Flights", Icon: PlaneIcon },
  { id: "hotel", label: "Hotels", Icon: BedIcon },
  { id: "car", label: "Car Rental", Icon: CarIcon },
];

const trustItems = [
  "24h Booking Confirmation",
  "Best Price Guarantee",
  "Secure Online Payment",
];

export function Hero() {
  const [tab, setTab] = useState<Tab>("flight");

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-center">
      <Image
        src="/images/safari1.jpg"
        alt="Southern Africa"
        fill
        className="object-cover object-center animate-ken-burns"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />

      <div className="absolute right-0 top-0 h-full w-1/3 hidden lg:flex items-center pointer-events-none opacity-20">
        <Image src="/images/path.svg" alt="" width={600} height={600} className="w-full" />
      </div>

      <div className="relative z-10 px-7 lg:px-28 pt-28 pb-20">
        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl text-white leading-none mb-5 max-w-3xl animate-fade-up" style={{ animationDelay: "150ms" }}>
          Find Your<br />
          <span className="italic text-orange">Perfect Trip</span>
        </h1>
        <p className="text-white/65 text-lg mb-10 max-w-lg leading-relaxed animate-fade-up" style={{ animationDelay: "300ms" }}>
          Flights · Hotels · Cars · Packages.<br />
          Mozambique, Zambia, Zimbabwe, South Africa and beyond.
        </p>

        {/* Booking widget */}
        <div className="bg-black/35 backdrop-blur-md rounded-2xl p-2 max-w-4xl border border-white/10 animate-fade-up" style={{ animationDelay: "450ms" }}>
          {/* Service tabs */}
          <div className="flex gap-1 px-1 pt-1 mb-2">
            {tabItems.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  tab === t.id
                    ? "bg-orange text-white shadow"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
              >
                <t.Icon />
                {t.label}
              </button>
            ))}
          </div>

          {/* Search row */}
          <div className="flex flex-col sm:flex-row gap-2 p-2 bg-white rounded-xl">
            <select className="flex-1 border border-shadow rounded-lg px-4 py-3 text-parablack text-sm focus:outline-none focus:border-orange bg-white min-w-0">
              <option value="">{tab === "car" ? "Pickup city" : "From"}</option>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select className="flex-1 border border-shadow rounded-lg px-4 py-3 text-parablack text-sm focus:outline-none focus:border-orange bg-white min-w-0">
              <option value="">{tab === "car" ? "Drop-off city" : tab === "hotel" ? "Destination" : "To"}</option>
              {cities.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input
              type="date"
              className="flex-1 border border-shadow rounded-lg px-4 py-3 text-parablack text-sm focus:outline-none focus:border-orange min-w-0"
            />
            <select className="border border-shadow rounded-lg px-4 py-3 text-parablack text-sm focus:outline-none focus:border-orange bg-white shrink-0">
              {tab === "hotel" ? (
                <>{[1, 2, 3, 4].map((n) => <option key={n}>{n} room{n > 1 ? "s" : ""}</option>)}</>
              ) : tab === "car" ? (
                <>
                  <option>Economy</option>
                  <option>SUV</option>
                  <option>4x4 Safari</option>
                  <option>Minibus</option>
                </>
              ) : (
                <>{[1, 2, 3, 4, 5, 6].map((n) => <option key={n}>{n} passenger{n > 1 ? "s" : ""}</option>)}</>
              )}
            </select>
            <Link
              href="/book"
              className="bg-orange hover:bg-orange/90 text-white rounded-lg px-8 py-3 text-sm font-bold uppercase transition-all duration-300 text-center shrink-0 whitespace-nowrap"
            >
              Search
            </Link>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-6 mt-8 animate-fade-up" style={{ animationDelay: "600ms" }}>
          {trustItems.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckIcon />
              <span className="text-white/55 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
