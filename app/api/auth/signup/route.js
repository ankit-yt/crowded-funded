import { hashPassword, generateToken } from "@/lib/auth"
import { createUser, getUserByEmail, initializeCollections } from "@/lib/models"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    await initializeCollections()

    const { email, password, name, role, bio, profileImage } = await request.json()

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)
    const userId = await createUser({
      email,
      password: hashedPassword,
      name,
      role,
      bio: bio || "",
      profileImage: profileImage || "",
      verified: false,
      createdAt: new Date(),
    })

    const token = generateToken(userId.toString(), role)

    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: userId,
          email,
          name,
          role,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
