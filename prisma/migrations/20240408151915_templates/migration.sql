/*
  Warnings:

  - You are about to drop the column `startedPrice` on the `Template` table. All the data in the column will be lost.
  - You are about to drop the column `stoppedPrice` on the `Template` table. All the data in the column will be lost.
  - Added the required column `version` to the `Template` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Template" DROP COLUMN "startedPrice",
DROP COLUMN "stoppedPrice",
ADD COLUMN     "version" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TemplateResource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "templateId" TEXT NOT NULL,
    "startedPrice" DOUBLE PRECISION NOT NULL,
    "stoppedPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TemplateResource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TemplateResource" ADD CONSTRAINT "TemplateResource_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
