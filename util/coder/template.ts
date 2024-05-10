"use server"

import { CoderTemplate, CoderTemplateResource } from "@/types/coder"
import { coderApiRequest, getOrganizationId } from "./apiRequest"
import { getPrisma } from "../db"
import { Template, TemplateToken } from "@prisma/client"

const prisma = getPrisma()

export async function getAllCoderTemplates() {
  const org = await getOrganizationId()
  const templates = await coderApiRequest({ method: "GET", path: `/organizations/${org}/templates` })
  return templates as CoderTemplate[]
}

export async function getCoderTemplate(id: string) {
  const template = await coderApiRequest({ method: "GET", path: `/templates/${id}` })
  return template as CoderTemplate
}

export async function importCoderTemplate(template: CoderTemplate, token: TemplateToken) {
  const importedTemplate = await prisma.template.create({
    data: {
      id: template.id,
      displayName: template.display_name,
      name: template.name,
      version: template.active_version_id,
      token: {
        connect: {
          id: token.id
        }
      }
    }
  })
  const resources = await coderApiRequest({ method: "GET", path: `/templateversions/${template.active_version_id}/resources` }) as CoderTemplateResource[]
  await prisma.templateResource.createMany({
    data: resources.map(resource => (
      {
        id: resource.id,
        name: resource.name,
        type: resource.type,
        templateId: template.id
      }
    )),
    skipDuplicates: true
  })
  return importedTemplate
}

export async function updateCoderTemplate(template: Template) {
  const coderTemplate = await getCoderTemplate(template.id)
  const resources = await coderApiRequest({ method: "GET", path: `/templateversions/${coderTemplate.active_version_id}/resources` }) as CoderTemplateResource[]
  // Update the template
  await prisma.template.update({
    where: {
      id: template.id
    },
    data: {
      version: coderTemplate.active_version_id
    }
  })
  // Update the resources, creating new ones and deleting removed ones
  await prisma.templateResource.deleteMany({
    where: {
      templateId: template.id,
      NOT: {
        id: {
          in: resources.map(resource => resource.id)
        }
      }
    }
  })
  resources.forEach(async resource => {
    await prisma.templateResource.upsert({
      where: {
        id: resource.id
      },
      update: {
        name: resource.name,
        type: resource.type
      },
      create: {
        id: resource.id,
        name: resource.name,
        type: resource.type,
        templateId: template.id
      },

    })
  })
}

export async function cleanupUnusedTokens() {
  await prisma.templateToken.deleteMany({
    where: {
      templateId: {
        equals: null
      }
    }
  })
}