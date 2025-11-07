import { getCampaigns, getCampaignCount, getInvestments, connectToDatabase } from "@/lib/models"
import { verifyToken, parseAuthHeader } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const token = parseAuthHeader(request.headers.get("Authorization"))
    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { db } = await connectToDatabase()

    // Get total stats
    const totalCampaigns = await getCampaignCount()
    const totalUsers = await db.collection("users").countDocuments()
    const allCampaigns = await getCampaigns({}, 100, 0)
    const allInvestments = await getInvestments({}, 1000, 0)

    // Calculate platform stats
    let totalFunded = 0
    let fundedCampaigns = 0
    let activeCampaigns = 0
    const totalTransactions = allInvestments.length
    let totalVolume = 0

    allCampaigns.forEach((campaign) => {
      if (campaign.status === "funded") fundedCampaigns++
      if (campaign.status === "active") activeCampaigns++
      totalFunded += campaign.currentAmount || 0
    })

    allInvestments.forEach((investment) => {
      totalVolume += investment.amount || 0
    })

    // Get campaigns by status
    const campaignsByStatus = await Promise.all([
      getCampaignCount({ status: "active" }),
      getCampaignCount({ status: "funded" }),
      getCampaignCount({ status: "closed" }),
      getCampaignCount({ status: "failed" }),
    ])

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalCampaigns,
        totalTransactions,
        totalVolume,
        fundedCampaigns,
        activeCampaigns,
      },
      campaignStatus: {
        active: campaignsByStatus[0],
        funded: campaignsByStatus[1],
        closed: campaignsByStatus[2],
        failed: campaignsByStatus[3],
      },
    })
  } catch (error) {
    console.error("Get admin dashboard error:", error)
    return NextResponse.json({ error: "Failed to fetch admin dashboard" }, { status: 500 })
  }
}
