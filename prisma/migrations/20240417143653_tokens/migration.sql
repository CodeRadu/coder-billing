/*
  Warnings:

  - You are about to drop the column `token` on the `Template` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Template" DROP COLUMN "token",
ADD COLUMN     "templateTokenId" TEXT;

-- CreateTable
CREATE TABLE "TemplateToken" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TemplateToken_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_templateTokenId_fkey" FOREIGN KEY ("templateTokenId") REFERENCES "TemplateToken"("id") ON DELETE SET NULL ON UPDATE CASCADE;
