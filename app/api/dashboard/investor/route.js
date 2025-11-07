import { getInvestments } from "@/lib/models"
import { verifyToken, parseAuthHeader } from "@/lib/auth"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request) {
  try {
    const token = parseAuthHeader(request.headers.get("Authorization"))
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = new ObjectId(decoded.userId)

    // Get investor's investments
    const investments = await getInvestments({ investorId: userId }, 100, 0)

    // Get campaign details for each investment
    const { db } = await connectToDatabase()
    const investmentsWithCampaigns = await Promise.all(
      investments.map(async (investment) => {
        const campaign = await db.collection("campaigns").findOne({
          _id: investment.campaignId,
        })
        return {
          ...investment,
          campaignTitle: campaign?.title || "Unknown Campaign",
          campaignStatus: campaign?.status || "unknown",
        }
      }),
    )

    // Calculate stats
    let totalInvested = 0
    investmentsWithCampaigns.forEach((investment) => {
      totalInvested += investment.amount || 0
    })

    return NextResponse.json({
      success: true,
      stats: {
        investmentCount: investments.length,
        totalInvested,
      },
      investments: investmentsWithCampaigns,
    })
  } catch (error) {
    console.error("Get investor dashboard error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
