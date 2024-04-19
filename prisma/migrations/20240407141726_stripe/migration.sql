/*
  Warnings:

  - Added the required column `subscriptionItemId` to the `StripeCustomer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StripeCustomer" ADD COLUMN     "subscriptionItemId" TEXT NOT NULL;
