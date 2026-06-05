import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Blog } from "@/components/sections/blog";

export const metadata: Metadata = {
  title: "Travel Blog — ZambiTour",
  description: "Travel tips, destination guides and insider stories from across Southern Africa.",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main>
        <div className="bg-leafy px-7 lg:px-28 pt-36 pb-14">
          <h1 className="text-4xl md:text-6xl text-white leading-tight">
            Travel <span className="italic">Blog</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-xl text-lg">
            Destination guides, travel tips and insider stories from across Southern Africa.
          </p>
        </div>
        <Blog />
      </main>
      <Footer />
    </>
  );
}
