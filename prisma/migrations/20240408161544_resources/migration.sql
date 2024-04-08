/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `StripeCustomer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `StripeCustomer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TemplateResource" DROP CONSTRAINT "TemplateResource_templateId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_stripeCustomerId_fkey";

-- AlterTable
ALTER TABLE "StripeCustomer" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "StripeCustomer_userId_key" ON "StripeCustomer"("userId");

-- AddForeignKey
ALTER TABLE "StripeCustomer" ADD CONSTRAINT "StripeCustomer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateResource" ADD CONSTRAINT "TemplateResource_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
