import { randomBytes } from "crypto";
import { getPrisma } from "./db";
import { SettingKey } from "@prisma/client";

export async function getSetting(key: SettingKey) {
  const prisma = getPrisma();
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value;
}