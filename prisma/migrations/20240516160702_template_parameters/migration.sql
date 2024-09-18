/*
  Warnings:

  - You are about to drop the `TemplateParameters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TemplateParameterOption" DROP CONSTRAINT "TemplateParameterOption_templateParameterId_fkey";

-- DropForeignKey
ALTER TABLE "TemplateParameters" DROP CONSTRAINT "TemplateParameters_templateId_fkey";

-- DropTable
DROP TABLE "TemplateParameters";

-- CreateTable
CREATE TABLE "TemplateParameter" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "type" "TemplateParameterType" NOT NULL,
    "validationMin" DOUBLE PRECISION,
    "validationMax" DOUBLE PRECISION,

    CONSTRAINT "TemplateParameter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TemplateParameter" ADD CONSTRAINT "TemplateParameter_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateParameterOption" ADD CONSTRAINT "TemplateParameterOption_templateParameterId_fkey" FOREIGN KEY ("templateParameterId") REFERENCES "TemplateParameter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
