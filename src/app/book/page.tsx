import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Booking } from "@/components/sections/booking";
import { Payment } from "@/components/sections/payment";

export const metadata: Metadata = {
  title: "Book Your Trip — ZambiTour",
  description: "Reserve flights, hotels and car rentals across Southern Africa. Receive confirmation within 24 hours.",
};

export default function BookPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="bg-leafy px-7 lg:px-28 pt-36 pb-14">
          <h1 className="text-4xl md:text-6xl text-white leading-tight">
            Make a <span className="italic">Reservation</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-xl text-lg">
            Fill in the form below and our team will confirm your booking within 24 hours. No payment required upfront.
          </p>
        </div>
        <Booking />
        <Payment />
      </main>
      <Footer />
    </>
  );
}
