import { CoderUser } from "@/types/coder";
import { env } from "../env";

const coderUrl = env.CODER_URL;
const coderApiKey = env.CODER_API_KEY;

export async function getOrganizationId() {
  const user = await coderApiRequest("GET", "/users/me") as CoderUser
  return user.organization_ids[0];
}

export async function coderApiRequest(method: string, path: string, body?: any) {
  const response = await fetch(`${coderUrl}/api/v2${path}`, {
    method,
    headers: {
      "Coder-Session-Token": coderApiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
  if (response.status !== 200) throw new Error(`Response status ${response.status}, when requested path ${path}`)
  return await response.json()
}