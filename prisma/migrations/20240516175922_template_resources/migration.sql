/*
  Warnings:

  - The primary key for the `TemplateParameterOption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[name,templateParameterId]` on the table `TemplateParameterOption` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `TemplateParameterOption` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "TemplateParameterOption" DROP CONSTRAINT "TemplateParameterOption_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "TemplateParameterOption_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateParameterOption_name_templateParameterId_key" ON "TemplateParameterOption"("name", "templateParameterId");
