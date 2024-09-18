-- CreateEnum
CREATE TYPE "PricingType" AS ENUM ('fixed', 'usageBased');

-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "priceId" TEXT,
ADD COLUMN     "pricingType" "PricingType" NOT NULL DEFAULT 'usageBased';
