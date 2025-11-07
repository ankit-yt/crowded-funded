import { getCampaigns } from "@/lib/models"
import { verifyToken, parseAuthHeader } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const token = parseAuthHeader(request.headers.get("Authorization"))
    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit")) || 50
    const skip = Number.parseInt(searchParams.get("skip")) || 0

    const campaigns = await getCampaigns({}, limit, skip)
    return NextResponse.json({ success: true, campaigns })
  } catch (error) {
    console.error("Get all campaigns error:", error)
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}
