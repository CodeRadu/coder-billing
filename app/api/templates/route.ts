import { getPrisma } from "@/util/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = getPrisma()

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const templates = await prisma.template.findMany();

  return NextResponse.json(templates);
}