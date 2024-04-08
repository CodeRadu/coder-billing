"use server"

import { CoderTemplate } from "@/types/coder";
import { getPrisma } from "../db";
import { Template } from "@prisma/client";

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