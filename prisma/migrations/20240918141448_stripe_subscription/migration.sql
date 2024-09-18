/*
  Warnings:

  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `StripeCustomer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StripeCustomer_stripeSubscriptionId_key" ON "StripeCustomer"("stripeSubscriptionId");
