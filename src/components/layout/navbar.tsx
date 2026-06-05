"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destinations" },
    { label: "Hotels", href: "/hotels" },
    { label: "Cars", href: "/cars" },
    { label: "About", href: "/about" },
  ];

  return (
    <>
      {/* Desktop navbar */}
      <div
        className={`text-white hidden lg:flex flex-row items-center justify-between py-5 px-10 fixed w-full z-50 top-0 border-b border-lightbeige/20 transition-all duration-300 ${
          scrolled ? "bg-leafy/95 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <Link href="/">
          <Image
            src="/images/zambitour.png"
            alt="ZambiTour"
            width={200}
            height={70}
            className="h-14 w-auto object-contain"
          />
        </Link>

        <ul className="flex flex-row justify-center gap-8 items-center text-sm font-medium">
          {navLinks.map((link) => (
            <li key={link.label} className="hover:text-orange transition-all duration-300">
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>

        <Link
          href="/book"
          className="bg-orange hover:bg-orange/90 text-white transition-all duration-300 rounded-3xl px-6 py-3 uppercase text-sm font-semibold"
        >
          Book Now
        </Link>
      </div>

      {/* Mobile navbar */}
      <div
        className={`border-b border-lightbeige/20 lg:hidden flex flex-row items-center justify-between py-3 px-6 md:px-10 fixed w-full z-50 top-0 transition-all duration-300 ${
          scrolled ? "bg-leafy/95 backdrop-blur-sm" : "bg-black/60"
        }`}
      >
        <Link href="/">
          <Image
            src="/images/zambitour.png"
            alt="ZambiTour"
            width={200}
            height={70}
            className="h-14 w-auto object-contain"
          />
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white p-2"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-leafy pt-16 overflow-y-auto">
          <div className="flex flex-col gap-6 px-6 py-8 text-white text-lg">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="hover:text-orange transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/book"
              onClick={() => setMobileOpen(false)}
              className="bg-orange rounded-3xl px-6 py-3 text-center uppercase text-sm font-semibold w-fit hover:bg-orange/90 transition-all"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
