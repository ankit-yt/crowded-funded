import { getCampaigns, getInvestments, getUserById } from "@/lib/models"
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

    // 1️⃣ Get entrepreneur's campaigns
    const campaigns = await getCampaigns({ entrepreneurId: userId }, 100, 0)

    // 2️⃣ For each campaign, get its investments and enrich with investor info
    const campaignsWithInvestors = await Promise.all(
      campaigns.map(async (campaign) => {
        const investments = await getInvestments({ campaignId: campaign._id })

        // Populate investor details (name, email)
        const enrichedInvestments = await Promise.all(
          investments.map(async (inv) => {
            const investor = await getUserById(inv.investorId)
            return {
              ...inv,
              investor: investor
                ? {
                    name: investor.name || "Unknown",
                    email: investor.email || "N/A",
                  }
                : null,
            }
          })
        )

        const totalRaised = investments.reduce((sum, i) => sum + (i.amount || 0), 0)

        return {
          ...campaign,
          totalRaised,
          investors: enrichedInvestments,
          investorCount: enrichedInvestments.length,
        }
      })
    )

    // 3️⃣ Calculate dashboard-level stats
    const totalRaised = campaignsWithInvestors.reduce((sum, c) => sum + c.totalRaised, 0)
    const totalInvestors = campaignsWithInvestors.reduce((sum, c) => sum + c.investorCount, 0)

    return NextResponse.json({
      success: true,
      stats: {
        campaignCount: campaignsWithInvestors.length,
        totalRaised,
        totalInvestors,
      },
      campaigns: campaignsWithInvestors,
    })
  } catch (error) {
    console.error("Get entrepreneur dashboard error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
