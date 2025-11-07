import { connectToDatabase } from "@/lib/mongodb"
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
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit")) || 50
    const skip = Number.parseInt(searchParams.get("skip")) || 0

    const users = await db.collection("users").find({}).sort({ createdAt: -1 }).limit(limit).skip(skip).toArray()

    // Remove passwords from response
    const safeUsers = users.map(({ password, ...user }) => user)

    return NextResponse.json({ success: true, users: safeUsers })
  } catch (error) {
    console.error("Get all users error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
