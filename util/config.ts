import { randomBytes } from "crypto";
import { getPrisma } from "./db";
import { SettingKey } from "@prisma/client";

export async function getSetting(key: SettingKey) {
  const prisma = getPrisma();
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value;
}

export async function setSetting(key: SettingKey, value: string) {
  const prisma = getPrisma();
  await prisma.setting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
}