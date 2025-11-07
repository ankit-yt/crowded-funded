import { verifyToken, parseAuthHeader } from "@/lib/auth"
import { getUserById } from "@/lib/models"
import { NextResponse } from "next/server"

export async function GET(request) {
  try {
    const token = parseAuthHeader(request.headers.get("Authorization"))

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const user = await getUserById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        profileImage: user.profileImage,
      },
    })
  } catch (error) {
    console.error("Verify error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
