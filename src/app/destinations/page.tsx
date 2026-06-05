import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Destinations } from "@/components/sections/destinations";
import { Tours } from "@/components/sections/tours";
import { Packages } from "@/components/sections/packages";

export const metadata: Metadata = {
  title: "Destinations & Tours — ZambiTour",
  description: "Explore Southern Africa's top destinations — from Victoria Falls to Mozambique's islands, Kruger to the Serengeti.",
};

export default function DestinationsPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="bg-leafy px-7 lg:px-28 pt-36 pb-0">
          <h1 className="text-4xl md:text-6xl text-white leading-tight">
            Explore <span className="italic">Southern Africa</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-xl text-lg pb-14">
            Discover our handpicked destinations, curated tours and all-inclusive travel packages across the region.
          </p>
        </div>
        <Destinations />
        <Tours />
        <Packages />
      </main>
      <Footer />
    </>
  );
}
