/*
  Warnings:

  - You are about to drop the column `templateTokenId` on the `Template` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[templateId]` on the table `TemplateToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Template" DROP CONSTRAINT "Template_templateTokenId_fkey";

-- AlterTable
ALTER TABLE "Template" DROP COLUMN "templateTokenId";

-- AlterTable
ALTER TABLE "TemplateToken" ADD COLUMN     "templateId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "TemplateToken_templateId_key" ON "TemplateToken"("templateId");

-- AddForeignKey
ALTER TABLE "TemplateToken" ADD CONSTRAINT "TemplateToken_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
