"use server";
import { Session } from "next-auth";
import { getPrisma } from "../db";

const prisma = getPrisma();

export async function getUser(session: Session) {
  if (!session.user?.email) return null
  return prisma.user.findUnique({
    where: {
      email: session.user?.email,
    },
  });
}

export async function getAllUsers() {
  return prisma.user.findMany();
}

export async function deleteUser(id: string) {
  return prisma.user.delete({ where: { id } })
}
