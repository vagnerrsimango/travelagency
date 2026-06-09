import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Playfair_Display, Raleway } from "next/font/google";
import { locales } from "@/i18n/config";
import { getLocalizedDictionary } from "@/i18n/server";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });

type LocaleParams = {
  params: Promise<{ lang: string }>;
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { lang } = await params;
  const { dict } = getLocalizedDictionary(lang);

  return dict.metadata.root;
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const { locale } = getLocalizedDictionary(lang);

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${playfairDisplay.variable} ${raleway.variable} font-sans overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
