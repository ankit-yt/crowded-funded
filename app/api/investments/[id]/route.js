import { getInvestmentById, updateInvestment } from "@/lib/models"
import { verifyToken, parseAuthHeader } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  try {
    const id = await Promise.resolve(params.id)
    const investment = await getInvestmentById(id)

    if (!investment) {
      return NextResponse.json({ error: "Investment not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, investment })
  } catch (error) {
    console.error("Get investment error:", error)
    return NextResponse.json({ error: "Failed to fetch investment" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const token = parseAuthHeader(request.headers.get("Authorization"))
    const decoded = verifyToken(token)

    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const id = await Promise.resolve(params.id)
    const updates = await request.json()
    const updated = await updateInvestment(id, updates)

    return NextResponse.json({ success: true, investment: updated })
  } catch (error) {
    console.error("Update investment error:", error)
    return NextResponse.json({ error: "Failed to update investment" }, { status: 500 })
  }
}
