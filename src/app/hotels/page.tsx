import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hotels } from "@/components/sections/hotels";
import { Booking } from "@/components/sections/booking";

export const metadata: Metadata = {
  title: "Hotels & Accommodation — ZambiTour",
  description: "Browse handpicked hotels, lodges and beach resorts across Southern Africa.",
};

export default function HotelsPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="bg-leafy px-7 lg:px-28 pt-36 pb-14">
          <h1 className="text-4xl md:text-6xl text-white leading-tight">
            Hotels & <span className="italic">Accommodation</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-xl text-lg">
            From beach resorts to city hotels and safari lodges — we partner with the best properties across the region.
          </p>
        </div>
        <Hotels />
        <Booking />
      </main>
      <Footer />
    </>
  );
}
