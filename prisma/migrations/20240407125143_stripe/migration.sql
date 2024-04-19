/*
  Warnings:

  - You are about to drop the column `stripeId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionEndDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `User` table. All the data in the column will be lost.
  - Added the required column `stripeCustomerId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "stripeId",
DROP COLUMN "stripeSubscriptionEndDate",
DROP COLUMN "stripeSubscriptionId",
ADD COLUMN     "stripeCustomerId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "StripeCustomer" (
    "id" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "stripeSubscriptionEndDate" TIMESTAMP(3),

    CONSTRAINT "StripeCustomer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_stripeCustomerId_fkey" FOREIGN KEY ("stripeCustomerId") REFERENCES "StripeCustomer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
