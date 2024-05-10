/*
  Warnings:

  - A unique constraint covering the columns `[name,type,templateId]` on the table `TemplateResource` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TemplateResource_name_templateId_key";

-- CreateIndex
CREATE UNIQUE INDEX "TemplateResource_name_type_templateId_key" ON "TemplateResource"("name", "type", "templateId");
