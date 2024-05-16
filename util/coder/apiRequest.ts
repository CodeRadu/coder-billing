import { CoderUser } from "@/types/coder";
import { env } from "../env";
import { getSetting } from "../config";

const coderUrl = env.CODER_URL
const coderApiKey = env.CODER_API_KEY

export async function getOrganizationId() {
  const user = CoderUser.parse(await coderApiRequest({ path: "/users/me", method: "GET" }))
  return user.organization_ids[0];
}

export async function coderApiRequest({ method, path, body }: { method: string, path: string, body?: any }) {
  if (!coderUrl || !coderApiKey) throw new Error("Coder URL or API key not set")
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