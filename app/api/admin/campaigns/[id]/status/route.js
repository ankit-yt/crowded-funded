import { getCampaignById, updateCampaign } from "@/lib/models"
import { verifyToken, parseAuthHeader } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function PUT(request, { params }) {
  try {
    const token = parseAuthHeader(request.headers.get("Authorization"))
    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const id = await Promise.resolve(params.id)
    const campaign = await getCampaignById(id)

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    const { status } = await request.json()
    const validStatuses = ["draft", "active", "funded", "closed", "failed"]

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const updated = await updateCampaign(id, { status })
    return NextResponse.json({ success: true, campaign: updated })
  } catch (error) {
    console.error("Update campaign status error:", error)
    return NextResponse.json({ error: "Failed to update campaign status" }, { status: 500 })
  }
}
