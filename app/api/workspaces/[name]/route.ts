import { CoderWorkspace } from "@/types/coder";
import { coderApiRequest } from "@/util/coder/apiRequest";
import { getPrisma } from "@/util/db";
import { stripe } from "@/util/stripe";
import { NextRequest, NextResponse } from "next/server";

const prisma = getPrisma()

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { workspaceId, transition } = body

  const workspace = await coderApiRequest("GET", `/workspaces/${workspaceId}`).catch(() => null) as CoderWorkspace | null // Get the workspace from Coder
  if (!workspace) return NextResponse.json({ status: "ok, workspace not found" }) // Probably a template update with a bogus workspace id

  const template = await prisma.template.findUnique({ where: { id: workspace.template_id }, include: { resources: true } })
  if (!template) return NextResponse.json({ status: "ok, template not configured" })

  const user = await prisma.user.findUnique({ where: { username: workspace.owner_name } })

  const customer = await prisma.stripeCustomer.findUnique({ where: { id: user!.stripeCustomerId! } })

  // Calculate pricing from resources
  const startedPrice = template.resources.reduce((total, resource) => {
    return total + (resource.startedPrice || 0);
  }, 0);
  const stoppedPrice = template.resources.reduce((total, resource) => {
    return total + (resource.stoppedPrice || 0);
  }, 0);

  if (startedPrice === 0 && stoppedPrice === 0) return NextResponse.json({ status: "ok, no pricing" })

  if (!await prisma.workspace.findUnique({ where: { id: workspaceId } })) {
    await prisma.workspace.create({
      data: {
        id: workspaceId,
        name: workspace.name,
        slug: workspace.name,
        templateId: workspace.template_id,
        userId: user!.id,
      }
    })
  }
  // Get the last build
  const lastBuild = await prisma.build.findFirst({
    where: {
      workspaceId,
    },
    orderBy: {
      createdAt: "desc",
    }
  })
  // Create a new build
  const build = await prisma.build.create({
    data: {
      workspaceId,
      action: transition
    }
  })

  if (!lastBuild) return NextResponse.json({ status: "ok, no last build" })

  if (user?.admin) return NextResponse.json({ status: "ok, user is admin" }) // Don't charge admins
  
  // If the last build was a start, charge the user with the started price
  if (lastBuild.action === "start") {
    // Calculate the time between the last build and this one
    const duration = build.createdAt.getTime() - lastBuild.createdAt.getTime()
    const durationHours = duration / (1000 * 60 * 60)

    // Calculate the amount to charge based on the total price and duration
    const amount = startedPrice * durationHours;

    await stripe.subscriptionItems.createUsageRecord(customer?.subscriptionItemId!, {
      quantity: Math.round(amount) * 100,
      timestamp: "now",
      action: "increment",
    })
  }

  // If the last build was a stop, charge the user with the stopped price
  if (lastBuild.action === "stop") {
    // Calculate the time between the last build and this one
    const duration = build.createdAt.getTime() - lastBuild.createdAt.getTime()
    const durationHours = duration / (1000 * 60 * 60)

    // Calculate the amount to charge based on the total price and duration
    const amount = stoppedPrice * durationHours

    await stripe.subscriptionItems.createUsageRecord(customer?.subscriptionItemId!, {
      quantity: Math.round(amount) * 100,
      timestamp: "now",
      action: "increment",
    })
  }

  // If the worspace is being destroyed, delete it
  if (build.action === "destroy") {
    await prisma.workspace.delete({ where: { id: workspaceId } })
  }
  return NextResponse.json({ status: "ok" })
}
