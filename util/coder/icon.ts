"use server"

import { env } from "../env"

export default function getIconPath(name: string) {
  return `${env.CODER_URL}/${name}`
}