import type { Metadata } from "next";
import { Inter, Playfair_Display, Raleway } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway" });

export const metadata: Metadata = {
  title: "ZambiTour — Southern Africa Travel Agency",
  description: "Book flights, hotels, car rentals and travel packages across Southern Africa. ZambiTour specialises in Mozambique, Zambia, Zimbabwe, South Africa and beyond.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfairDisplay.variable} ${raleway.variable} font-sans overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
