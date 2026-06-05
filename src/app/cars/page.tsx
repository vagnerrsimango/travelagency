import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Cars } from "@/components/sections/cars";
import { Booking } from "@/components/sections/booking";

export const metadata: Metadata = {
  title: "Car Rentals — ZambiTour",
  description: "Rent economy sedans, SUVs, 4x4 safari vehicles and minibuses across Southern Africa.",
};

export default function CarsPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="bg-leafy px-7 lg:px-28 pt-36 pb-14">
          <h1 className="text-4xl md:text-6xl text-white leading-tight">
            Car <span className="italic">Rentals</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-xl text-lg">
            Choose the right vehicle for your journey — city sedans to fully-equipped 4x4 safari vehicles. Pick up anywhere in the region.
          </p>
        </div>
        <Cars />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
