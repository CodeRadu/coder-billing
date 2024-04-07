import { CoderWorkspace } from "@/types/coder";
import { coderApiRequest } from "@/util/coder/apiRequest";
import { getPrisma } from "@/util/db";
import { stripe } from "@/util/stripe";
import { NextRequest, NextResponse } from "next/server";

const prisma = getPrisma()

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { workspaceId, transition } = body
  const workspace = await coderApiRequest("GET", `/workspaces/${workspaceId}`).catch(() => null) as CoderWorkspace | null
  if (!workspace) return NextResponse.json({ status: "ok, workspace not found" })
  const template = await prisma.template.findUnique({ where: { id: workspace.template_id } })
  if (!template) {
    return NextResponse.json({ status: "ok, template not configured" })
  }
  if (!template?.startedPrice || !template?.stoppedPrice) {
    return NextResponse.json({ status: "ok, no price" })
  }
  const user = await prisma.user.findUnique({ where: { username: workspace.owner_name } })
  if (user?.admin) return NextResponse.json({ status: "ok, user is admin" })
  const customer = await prisma.stripeCustomer.findUnique({ where: { id: user!.stripeCustomerId! } })
  if (customer?.stripeSubscriptionEndDate && transition == "start") {
    // Prevent the user from starting the workspace if the subscription has been cancelled
    return NextResponse.json({ status: "subscription ended" }, { status: 500 })
  }
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
  const build = await prisma.build.create({
    data: {
      action: transition,
      workspaceId: workspaceId
    }
  })
  // We have the latest build
  // If this build stops the workspace, we need to find the last start build
  if (transition == "stop" || transition == "destroy") {
    const lastStart = await prisma.build.findFirst({
      where: {
        workspaceId,
        action: "start"
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    if (!lastStart) return NextResponse.json({ status: "ok" })
    const timeDifference = (new Date(build.createdAt).getTime() - new Date(lastStart!.createdAt).getTime()) / (1000 * 60 * 60)
    // We will now tell stripe that the user has used the workspace for this amount of time
    await stripe.subscriptionItems.createUsageRecord(customer?.subscriptionItemId!, {
      action: 'increment',
      quantity: Math.round(template?.startedPrice * timeDifference),
      timestamp: 'now'
    })
  }
  if (transition == "start") {
    const lastStop = await prisma.build.findFirst({
      where: {
        workspaceId,
        action: "stop"
      },
      orderBy: {
        createdAt: "desc"
      }
    })
    if (!lastStop) return NextResponse.json({ status: "ok" })

    const timeDifference = (new Date(build.createdAt).getTime() - new Date(lastStop!.createdAt).getTime()) / (1000 * 60 * 60)
    // We will now tell stripe that the user has used the workspace for this amount of time
    await stripe.subscriptionItems.createUsageRecord(customer?.subscriptionItemId!, {
      action: 'increment',
      quantity: Math.round(template?.stoppedPrice * timeDifference),
      timestamp: 'now'
    })
  }
  return NextResponse.json({ status: "ok" })
}