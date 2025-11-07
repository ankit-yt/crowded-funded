import { comparePassword, generateToken } from "@/lib/auth"
import { getUserByEmail } from "@/lib/models"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const passwordValid = await comparePassword(password, user.password)
    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = generateToken(user._id.toString(), user.role)

    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          profileImage: user.profileImage,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
