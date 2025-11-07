import { createInvestment, getInvestments, updateCampaign, getCampaignById } from "@/lib/models"
import { verifyToken, parseAuthHeader } from "@/lib/auth"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request) {
  try {
    const token = parseAuthHeader(request.headers.get("Authorization"))
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit")) || 20
    const skip = Number.parseInt(searchParams.get("skip")) || 0

    const filter = {}
    if (searchParams.get("type") === "my-investments") {
      filter.investorId = new ObjectId(decoded.userId)
    } else if (searchParams.get("type") === "campaign-investments") {
      filter.campaignId = new ObjectId(searchParams.get("campaignId"))
    }

    const investments = await getInvestments(filter, limit, skip)
    return NextResponse.json({ success: true, investments })
  } catch (error) {
    console.error("Get investments error:", error)
    return NextResponse.json({ error: "Failed to fetch investments" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const token = parseAuthHeader(request.headers.get("Authorization"))
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { campaignId, amount } = await request.json()

    if (!campaignId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid investment data" }, { status: 400 })
    }

    const campaign = await getCampaignById(campaignId)
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    if (campaign.entrepreneurId.toString() === decoded.userId) {
      return NextResponse.json({ error: "Cannot invest in your own campaign" }, { status: 400 })
    }

    const investmentId = await createInvestment({
      campaignId: new ObjectId(campaignId),
      investorId: new ObjectId(decoded.userId),
      amount: Number.parseFloat(amount),
      status: "completed",
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      createdAt: new Date(),
    })

    // Update campaign with new investment
    const newAmount = campaign.currentAmount + Number.parseFloat(amount)
    const newStatus = newAmount >= campaign.targetAmount ? "funded" : campaign.status

    await updateCampaign(campaignId, {
      currentAmount: newAmount,
      status: newStatus,
      investorCount: campaign.investorCount + 1,
    })

    return NextResponse.json(
      {
        success: true,
        investmentId,
        message: "Investment completed successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create investment error:", error)
    return NextResponse.json({ error: "Failed to create investment" }, { status: 500 })
  }
}
