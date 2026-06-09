"use client";

import { useState } from "react";
import Image from "next/image";
import type { Dictionary } from "@/i18n/types";

type ServiceTab = "flight" | "hotel" | "car";

type BookingProps = {
  copy: Dictionary["sections"]["booking"];
};

const inputClass =
  "w-full bg-transparent border border-white/30 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-orange transition-colors text-sm";

const labelClass = "block text-xs mb-1.5 text-white/70 uppercase tracking-wide";

const destinations = [
  "Maputo", "Beira", "Nampula", "Pemba", "Quelimane",
  "Johannesburg", "Cape Town", "Durban",
  "Harare", "Victoria Falls",
  "Lusaka", "Livingstone",
  "Nairobi", "Dar es Salaam", "Zanzibar",
  "Gaborone", "Windhoek",
  "Lisbon", "Dubai", "London",
];

const PlaneIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
  </svg>
);

const BedIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
    <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
  </svg>
);

const CarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </svg>
);

type TabItem = { id: ServiceTab; label: string; Icon: () => React.ReactElement };

function countLabel(count: number, singular: string, plural: string) {
  return `${count} ${count > 1 ? plural : singular}`;
}

export function Booking({ copy }: BookingProps) {
  const [activeTab, setActiveTab] = useState<ServiceTab>("flight");

  const tabs: TabItem[] = [
    { id: "flight", label: copy.tabs.flight, Icon: PlaneIcon },
    { id: "hotel", label: copy.tabs.hotel, Icon: BedIcon },
    { id: "car", label: copy.tabs.car, Icon: CarIcon },
  ];

  return (
    <div className="bg-beige px-7 lg:px-28 pt-14 lg:pt-28 pb-14 lg:pb-28 relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
        {/* Left: full-height cover image */}
        <div className="relative hidden lg:block rounded-2xl overflow-hidden min-h-[500px]">
          <Image
            src="/images/desc2.jpg"
            alt={copy.imageAlt}
            fill
            sizes="50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10">
            <p className="text-orange text-xs uppercase tracking-widest font-semibold mb-3">{copy.brand}</p>
            <p className="text-white text-3xl leading-snug">
              {copy.imageTitleLine1}<br />{copy.imageTitleLine2}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-8 h-px bg-orange" />
              <p className="text-white/60 text-sm">{copy.tagline}</p>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="bg-leafy rounded-2xl px-8 py-10 text-white">
          <h2 className="text-3xl md:text-4xl text-white mb-2 leading-tight">
            {copy.title} <span className="italic">{copy.titleAccent}</span>
          </h2>
          <p className="text-white/50 text-sm mb-8">
            {copy.description}
          </p>

          {/* Service tabs */}
          <div className="flex gap-1 mb-8 p-1 bg-white/10 rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs uppercase font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-orange text-white shadow"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <tab.Icon />
                {tab.label}
              </button>
            ))}
          </div>

          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            {/* Trip-specific top fields */}
            {activeTab === "flight" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{copy.labels.from}</label>
                    <select className={inputClass + " bg-leafy"}>
                      <option value="">{copy.placeholders.departureCity}</option>
                      {destinations.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>{copy.labels.to}</label>
                    <select className={inputClass + " bg-leafy"}>
                      <option value="">{copy.placeholders.destinationCity}</option>
                      {destinations.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{copy.labels.departureDate}</label>
                    <input type="date" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{copy.labels.returnDate}</label>
                    <input type="date" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{copy.labels.passengers}</label>
                  <select className={inputClass + " bg-leafy"}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>{countLabel(n, copy.passengers.singular, copy.passengers.plural)}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {activeTab === "hotel" && (
              <>
                <div>
                  <label className={labelClass}>{copy.labels.destination}</label>
                  <select className={inputClass + " bg-leafy"}>
                    <option value="">{copy.placeholders.selectCity}</option>
                    {destinations.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{copy.labels.checkIn}</label>
                    <input type="date" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{copy.labels.checkOut}</label>
                    <input type="date" className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{copy.labels.rooms}</label>
                    <select className={inputClass + " bg-leafy"}>
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>{countLabel(n, copy.rooms.singular, copy.rooms.plural)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>{copy.labels.guests}</label>
                    <select className={inputClass + " bg-leafy"}>
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>{countLabel(n, copy.guests.singular, copy.guests.plural)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            {activeTab === "car" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{copy.labels.pickupCity}</label>
                    <select className={inputClass + " bg-leafy"}>
                      <option value="">{copy.placeholders.selectCity}</option>
                      {destinations.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>{copy.labels.dropOffCity}</label>
                    <select className={inputClass + " bg-leafy"}>
                      <option value="">{copy.placeholders.sameAsPickup}</option>
                      {destinations.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{copy.labels.pickupDate}</label>
                    <input type="date" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>{copy.labels.returnDateRequired}</label>
                    <input type="date" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>{copy.labels.vehicleType}</label>
                  <select className={inputClass + " bg-leafy"}>
                    <option value="">{copy.placeholders.anyVehicle}</option>
                    {copy.vehicleTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Divider */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-4">{copy.labels.yourDetails}</p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className={labelClass}>{copy.labels.fullName}</label>
                  <input
                    type="text"
                    placeholder={copy.placeholders.fullName}
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{copy.labels.phone}</label>
                    <input
                      type="tel"
                      placeholder={copy.placeholders.phone}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{copy.labels.email}</label>
                    <input
                      type="email"
                      placeholder={copy.placeholders.email}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-orange hover:bg-orange/90 text-white rounded-3xl px-8 py-3 uppercase text-sm font-semibold transition-all duration-300 w-full mt-2 cursor-pointer"
            >
              {copy.submit}
            </button>
            <p className="text-center text-white/30 text-xs">
              {copy.note}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
