-- CreateEnum
CREATE TYPE "PackageTheme" AS ENUM ('BEACH', 'SAFARI', 'ISLAND', 'LUXURY', 'CULTURAL', 'ADVENTURE', 'CITY');

-- AlterTable
ALTER TABLE "destinations" ADD COLUMN     "taglineEn" TEXT,
ADD COLUMN     "taglinePt" TEXT;

-- AlterTable
ALTER TABLE "promo_offers" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "highlightEn" TEXT,
ADD COLUMN     "highlightPt" TEXT;

-- AlterTable
ALTER TABLE "travel_packages" ADD COLUMN     "theme" "PackageTheme";

-- AlterTable
ALTER TABLE "vehicles" ADD COLUMN     "type" TEXT;
