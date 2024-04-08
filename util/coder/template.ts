"use server"

import { CoderTemplate, CoderTemplateResource } from "@/types/coder"
import { coderApiRequest, getOrganizationId } from "./apiRequest"
import { getPrisma } from "../db"

const prisma = getPrisma()

export async function getAllCoderTemplates() {
  const org = await getOrganizationId()
  const templates = await coderApiRequest("GET", `/organizations/${org}/templates`)
  return templates as CoderTemplate[]
}

export async function getCoderTemplate(id: string) {
  const template = await coderApiRequest("GET", `/templates/${id}`)
  return template as CoderTemplate
}

export async function getCoderTemplateResources(versionId: string) {
  const resources = await coderApiRequest("GET", `/templateversions/${versionId}/resources`)
  console.log(resources)
  return resources
}

export async function importCoderTemplate(template: CoderTemplate) {
  const importedTemplate = await prisma.template.create({
    data: {
      id: template.id,
      displayName: template.display_name,
      name: template.name,
      version: template.active_version_id
    }
  })
  const resources = await coderApiRequest("GET", `/templateversions/${template.active_version_id}/resources`) as CoderTemplateResource[]
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