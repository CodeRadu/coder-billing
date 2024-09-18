import { getPrisma } from "@/util/db";
import { getUser } from "@/util/db/user";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const prisma = getPrisma();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = params;
  const template = await prisma.template.findUnique({ where: { id }, include: { resources: true } });
  if (!template) return NextResponse.json({ error: "template not found" }, { status: 404 });
  return NextResponse.json(template);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = await getUser(session);
  if (!user || !user.admin) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = params;
  const body = await req.json();

  console.table(body)

  const template = await prisma.template.update({
    where: { id },
    data: {
      resources: {
        updateMany: body.resources.map((resource: any) => ({
          where: { id: resource.id },
          data: {
            startedPrice: resource.startedPrice,
            stoppedPrice: resource.stoppedPrice
          }
        }))
      },
      priceId: body.priceId,
      pricingType: body.pricingType
    },
    include: { resources: true }
  })

  return NextResponse.json(template);
}