export interface User {
  _id?: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: "entrepreneur" | "investor" | "admin"
  bio?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Campaign {
  _id?: string
  title: string
  description: string
  category: string
  goal: number
  raised: number
  userId: string
  status: "draft" | "active" | "funded" | "rejected"
  image?: string
  deadline: Date
  createdAt: Date
  updatedAt: Date
}

export interface Investment {
  _id?: string
  campaignId: string
  investorId: string
  amount: number
  equity?: number
  status: "pending" | "completed" | "rejected"
  transactionId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  _id?: string
  campaignId: string
  adminId: string
  status: "approved" | "rejected"
  feedback: string
  createdAt: Date
}
