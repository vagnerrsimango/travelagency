-- Follow-up to 20260907110002_init, from the schema pressure-test pass:
-- 1. Rename Reservation.notes -> customerRemarks (was colliding in naming
--    intent with the ReservationNote relation, now renamed to agentNotes
--    which has no DB column of its own).
-- 2. Extend PromoOffer to also target FlightOffer and AncillaryService,
--    for parity with Hotel/Vehicle/TravelPackage (BRD §8.4 promo pricing
--    should be able to apply to any sellable product, not a subset).
-- 3. Add missing indexes on Customer.email and Reservation.agentId.
-- 4. Add CHECK constraints Prisma's schema DSL can't express natively:
--    - a Reservation must reference exactly the one catalog item that
--      matches its serviceType (or none, for CUSTOM requests).
--    - a PromoOffer must target exactly one catalog item.

ALTER TABLE "reservations" RENAME COLUMN "notes" TO "customerRemarks";

ALTER TABLE "promo_offers" ADD COLUMN "flightOfferId" TEXT;
ALTER TABLE "promo_offers" ADD COLUMN "ancillaryServiceId" TEXT;

ALTER TABLE "promo_offers" ADD CONSTRAINT "promo_offers_flightOfferId_fkey"
  FOREIGN KEY ("flightOfferId") REFERENCES "flight_offers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "promo_offers" ADD CONSTRAINT "promo_offers_ancillaryServiceId_fkey"
  FOREIGN KEY ("ancillaryServiceId") REFERENCES "ancillary_services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "customers_email_idx" ON "customers"("email");
CREATE INDEX "reservations_agentId_idx" ON "reservations"("agentId");

ALTER TABLE "reservations" ADD CONSTRAINT "reservation_service_ref_check" CHECK (
  ("serviceType" = 'CUSTOM'  AND "flightOfferId" IS NULL     AND "hotelId" IS NULL AND "vehicleId" IS NULL AND "packageId" IS NULL AND "ancillaryServiceId" IS NULL) OR
  ("serviceType" = 'FLIGHT'  AND "flightOfferId" IS NOT NULL AND "hotelId" IS NULL AND "vehicleId" IS NULL AND "packageId" IS NULL AND "ancillaryServiceId" IS NULL) OR
  ("serviceType" = 'HOTEL'   AND "hotelId" IS NOT NULL       AND "flightOfferId" IS NULL AND "vehicleId" IS NULL AND "packageId" IS NULL AND "ancillaryServiceId" IS NULL) OR
  ("serviceType" = 'CAR'     AND "vehicleId" IS NOT NULL     AND "flightOfferId" IS NULL AND "hotelId" IS NULL AND "packageId" IS NULL AND "ancillaryServiceId" IS NULL) OR
  ("serviceType" = 'PACKAGE' AND "packageId" IS NOT NULL     AND "flightOfferId" IS NULL AND "hotelId" IS NULL AND "vehicleId" IS NULL AND "ancillaryServiceId" IS NULL) OR
  ("serviceType" = 'SERVICE' AND "ancillaryServiceId" IS NOT NULL AND "flightOfferId" IS NULL AND "hotelId" IS NULL AND "vehicleId" IS NULL AND "packageId" IS NULL)
);

ALTER TABLE "promo_offers" ADD CONSTRAINT "promo_offer_single_target_check" CHECK (
  (
    (CASE WHEN "flightOfferId" IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN "hotelId" IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN "vehicleId" IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN "packageId" IS NOT NULL THEN 1 ELSE 0 END) +
    (CASE WHEN "ancillaryServiceId" IS NOT NULL THEN 1 ELSE 0 END)
  ) = 1
);
