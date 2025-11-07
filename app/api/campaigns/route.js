import { getCampaigns, getCampaignCount, createCampaign } from "@/lib/models"
import { verifyToken, parseAuthHeader } from "@/lib/auth"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page")) || 1
    const limit = Number.parseInt(searchParams.get("limit")) || 12
    const status = searchParams.get("status")
    const skip = (page - 1) * limit

    const filter = {}
    if (status) filter.status = status

    const campaigns = await getCampaigns(filter, limit, skip)
    const total = await getCampaignCount(filter)

    return NextResponse.json({
      success: true,
      campaigns,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Get campaigns error:", error)
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const token = parseAuthHeader(request.headers.get("Authorization"))
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { title, description, targetAmount, deadline, category, image } = data

    if (!title || !description || !targetAmount || !deadline || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const campaignId = await createCampaign({
      entrepreneurId: new ObjectId(decoded.userId),
      title,
      description,
      targetAmount: Number.parseFloat(targetAmount),
      currentAmount: 0,
      deadline: new Date(deadline),
      category,
      image: image || "",
      status: "active",
      investorCount: 0,
      reviews: [],
      createdAt: new Date(),
    })

    return NextResponse.json(
      {
        success: true,
        campaignId,
        message: "Campaign created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create campaign error:", error)
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
  }
}
