/*
  Warnings:

  - Added the required column `stripeSubscriptionEndDate` to the `StripeCustomer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StripeCustomer" DROP COLUMN "stripeSubscriptionEndDate",
ADD COLUMN     "stripeSubscriptionEndDate" INTEGER NOT NULL;
