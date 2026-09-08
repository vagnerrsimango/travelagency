-- Flight routes are open (any city pair, agent-quoted) unlike hotels,
-- vehicles, packages and services, which are always concrete catalog
-- items. The original check constraint (20260907120000) required every
-- FLIGHT reservation to reference a published FlightOffer — too strict
-- once open flight quote requests were designed as a real, intentional
-- path (a customer books "Maputo -> Beira" with no matching published
-- fare, and an agent prices it by hand). Every other service type keeps
-- its original "FK must be set" requirement unchanged.
ALTER TABLE "reservations" DROP CONSTRAINT "reservation_service_ref_check";

ALTER TABLE "reservations" ADD CONSTRAINT "reservation_service_ref_check" CHECK (
  ("serviceType" = 'CUSTOM'  AND "flightOfferId" IS NULL                          AND "hotelId" IS NULL AND "vehicleId" IS NULL AND "packageId" IS NULL AND "ancillaryServiceId" IS NULL) OR
  ("serviceType" = 'FLIGHT'                                                       AND "hotelId" IS NULL AND "vehicleId" IS NULL AND "packageId" IS NULL AND "ancillaryServiceId" IS NULL) OR
  ("serviceType" = 'HOTEL'   AND "hotelId" IS NOT NULL       AND "flightOfferId" IS NULL AND "vehicleId" IS NULL AND "packageId" IS NULL AND "ancillaryServiceId" IS NULL) OR
  ("serviceType" = 'CAR'     AND "vehicleId" IS NOT NULL     AND "flightOfferId" IS NULL AND "hotelId" IS NULL AND "packageId" IS NULL AND "ancillaryServiceId" IS NULL) OR
  ("serviceType" = 'PACKAGE' AND "packageId" IS NOT NULL     AND "flightOfferId" IS NULL AND "hotelId" IS NULL AND "vehicleId" IS NULL AND "ancillaryServiceId" IS NULL) OR
  ("serviceType" = 'SERVICE' AND "ancillaryServiceId" IS NOT NULL AND "flightOfferId" IS NULL AND "hotelId" IS NULL AND "vehicleId" IS NULL AND "packageId" IS NULL)
);
