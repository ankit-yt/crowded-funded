import { getUserById, updateUser } from "@/lib/models"
import { verifyToken, parseAuthHeader } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const token = parseAuthHeader(request.headers.get("Authorization"))
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user
    return NextResponse.json({ success: true, user: userWithoutPassword })
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const token = parseAuthHeader(request.headers.get("Authorization"))
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()
    const allowedUpdates = ["name", "bio", "profileImage"]
    const filteredUpdates = {}

    allowedUpdates.forEach((key) => {
      if (key in updates) {
        filteredUpdates[key] = updates[key]
      }
    })

    const updated = await updateUser(decoded.userId, filteredUpdates)
    const { password, ...userWithoutPassword } = updated

    return NextResponse.json({ success: true, user: userWithoutPassword })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
