"use server"

import { getPrisma } from "../db";

const prisma = getPrisma()

export async function getTemplate(id: string) {
  const template = await prisma.template.findUnique({
    where: {
      id
    }
  })
  return template
}

export async function getAllTemplates() {
  const templates = await prisma.template.findMany()
  return templates
}

export async function deleteTemplate(id: string) {
  return prisma.template.delete({
    where: {
      id
    }
  })
}