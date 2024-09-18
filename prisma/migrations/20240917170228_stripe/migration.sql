/*
  Warnings:

  - You are about to drop the column `subscriptionItemId` on the `StripeCustomer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StripeCustomer" DROP COLUMN "subscriptionItemId",
ADD COLUMN     "subscriptionItems" TEXT[];
