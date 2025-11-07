import { getCampaigns } from "@/lib/models"
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

    const userId = new ObjectId(decoded.userId)

    // Get entrepreneur's campaigns
    const campaigns = await getCampaigns({ entrepreneurId: userId }, 100, 0)

    // Calculate stats
    let totalRaised = 0
    let totalInvestors = 0
    campaigns.forEach((campaign) => {
      totalRaised += campaign.currentAmount || 0
      totalInvestors += campaign.investorCount || 0
    })

    return NextResponse.json({
      success: true,
      stats: {
        campaignCount: campaigns.length,
        totalRaised,
        totalInvestors,
      },
      campaigns,
    })
  } catch (error) {
    console.error("Get entrepreneur dashboard error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
