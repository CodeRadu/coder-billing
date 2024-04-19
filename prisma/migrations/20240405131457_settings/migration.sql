-- CreateEnum
CREATE TYPE "SettingKey" AS ENUM ('CODER_URL', 'CODER_API_KEY');

-- CreateTable
CREATE TABLE "Setting" (
    "key" "SettingKey" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("key")
);
