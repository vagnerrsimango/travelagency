-- AlterTable
ALTER TABLE "ancillary_services" ADD COLUMN     "basePrice" DECIMAL(12,2),
ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT 'MZN';
