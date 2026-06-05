export const siteConfig = {
  name: "Travel Agency",
  description: "Curated journeys, practical planning, and reliable support.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  navItems: [
    { label: "Destinations", href: "#destinations" },
    { label: "Packages", href: "#packages" },
    { label: "Contact", href: "#contact" },
  ],
};
