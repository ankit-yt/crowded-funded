import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_change_in_production"
const JWT_EXPIRY = "7d"

export async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash)
}

export function generateToken(userId, role) {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function parseAuthHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }
  return authHeader.substring(7)
}
