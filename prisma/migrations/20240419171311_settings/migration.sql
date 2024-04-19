/*
  Warnings:

  - The values [CODER_URL,CODER_API_KEY,STRIPE_PUBLISHABLE_KEY,STRIPE_SECRET_KEY,STRIPE_SIGNING_SECRET,STRIPE_CURRENCY] on the enum `SettingKey` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SettingKey_new" AS ENUM ('CONFIGURED', 'STRIPE_UNIT_PRICE');
ALTER TABLE "Setting" ALTER COLUMN "key" TYPE "SettingKey_new" USING ("key"::text::"SettingKey_new");
ALTER TYPE "SettingKey" RENAME TO "SettingKey_old";
ALTER TYPE "SettingKey_new" RENAME TO "SettingKey";
DROP TYPE "SettingKey_old";
COMMIT;
