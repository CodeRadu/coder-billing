-- CreateEnum
CREATE TYPE "TemplateParameterType" AS ENUM ('number', 'string', 'bool', 'stringlist');

-- CreateTable
CREATE TABLE "TemplateParameters" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "type" "TemplateParameterType" NOT NULL,
    "validationMin" DOUBLE PRECISION,
    "validationMax" DOUBLE PRECISION,

    CONSTRAINT "TemplateParameters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateParameterOption" (
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "templateParameterId" TEXT NOT NULL,

    CONSTRAINT "TemplateParameterOption_pkey" PRIMARY KEY ("name","templateParameterId")
);

-- AddForeignKey
ALTER TABLE "TemplateParameters" ADD CONSTRAINT "TemplateParameters_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateParameterOption" ADD CONSTRAINT "TemplateParameterOption_templateParameterId_fkey" FOREIGN KEY ("templateParameterId") REFERENCES "TemplateParameters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
