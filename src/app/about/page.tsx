import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";

export const metadata: Metadata = {
  title: "About ZambiTour — Southern Africa Travel Agency",
  description: "Learn about ZambiTour — Southern Africa's trusted travel partner for flights, hotels, car rentals and safari packages.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="bg-leafy px-7 lg:px-28 pt-36 pb-14">
          <h1 className="text-4xl md:text-6xl text-white leading-tight">
            About <span className="italic">ZambiTour</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-xl text-lg">
            Southern Africa&apos;s trusted travel partner — built on local knowledge, passion and a commitment to making your journey seamless.
          </p>
        </div>
        <About />
        <Services />
      </main>
      <Footer />
    </>
  );
}
