import { HotelService } from "@/lib/data-access/hotels";
import { VehicleService } from "@/lib/data-access/vehicles";
import { PackageService } from "@/lib/data-access/packages";
import type { CatalogOption } from "@/components/sections/booking";
import type { Locale } from "@/i18n/config";

// The booking form's hotel/car/package pickers need real, published items
// with a display name and starting price — used on every page that
// renders <Booking> (book, hotels, cars), so this lives in one place.
export async function getBookingCatalogOptions(locale: Locale) {
  const [hotels, vehicles, packages] = await Promise.all([
    HotelService.findAll({ status: "PUBLISHED" }),
    VehicleService.findAll({ status: "PUBLISHED" }),
    PackageService.findAll({ status: "PUBLISHED" }),
  ]);

  const hotelOptions: CatalogOption[] = hotels.map((h) => ({
    id: h.id,
    name: locale === "pt" ? h.namePt : h.nameEn,
    price: Number(h.pricePerNight),
    currency: h.currency,
  }));

  const vehicleOptions: CatalogOption[] = vehicles.map((v) => ({
    id: v.id,
    name: `${v.category} · ${v.model}`,
    price: Number(v.pricePerDay),
    currency: v.currency,
  }));

  const packageOptions: CatalogOption[] = packages.map((p) => ({
    id: p.id,
    name: locale === "pt" ? p.namePt : p.nameEn,
    price: Number(p.pricePerPerson),
    currency: p.currency,
    included: p.inclusions,
  }));

  return { hotels: hotelOptions, vehicles: vehicleOptions, packages: packageOptions };
}
