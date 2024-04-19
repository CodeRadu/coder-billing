/*
  Warnings:

  - A unique constraint covering the columns `[name,templateId]` on the table `TemplateResource` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TemplateResource_name_templateId_key" ON "TemplateResource"("name", "templateId");
