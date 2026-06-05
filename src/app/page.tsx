import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { BookingOptions } from "@/components/sections/booking-options";
import { PromoFares } from "@/components/sections/promo-fares";
import { HowItWorks } from "@/components/sections/how-it-works";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BookingOptions />
        <PromoFares />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
