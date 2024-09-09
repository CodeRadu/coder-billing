-- AlterTable
ALTER TABLE "TemplateParameter" ADD COLUMN     "startedPricePerUnit" DOUBLE PRECISION,
ADD COLUMN     "stoppedPricePerUnit" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "TemplateParameterOption" ADD COLUMN     "startedPrice" DOUBLE PRECISION,
ADD COLUMN     "stoppedPrice" DOUBLE PRECISION;
