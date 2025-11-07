import { connectToDatabase } from "./mongodb.js"

export { connectToDatabase }

export const ROLES = {
  ENTREPRENEUR: "entrepreneur",
  INVESTOR: "investor",
  ADMIN: "admin",
}

export const CAMPAIGN_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  FUNDED: "funded",
  CLOSED: "closed",
  FAILED: "failed",
}

export const INVESTMENT_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  COMPLETED: "completed",
  REJECTED: "rejected",
}

export async function initializeCollections() {
  const { db } = await connectToDatabase()

  // Create collections if they don't exist
  const collections = await db.listCollections().toArray()
  const collectionNames = collections.map((c) => c.name)

  if (!collectionNames.includes("users")) {
    await db.createCollection("users")
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("users").createIndex({ createdAt: 1 })
  }

  if (!collectionNames.includes("campaigns")) {
    await db.createCollection("campaigns")
    await db.collection("campaigns").createIndex({ entrepreneurId: 1 })
    await db.collection("campaigns").createIndex({ status: 1 })
    await db.collection("campaigns").createIndex({ createdAt: -1 })
  }

  if (!collectionNames.includes("investments")) {
    await db.createCollection("investments")
    await db.collection("investments").createIndex({ campaignId: 1 })
    await db.collection("investments").createIndex({ investorId: 1 })
    await db.collection("investments").createIndex({ status: 1 })
    await db.collection("investments").createIndex({ createdAt: -1 })
  }

  if (!collectionNames.includes("reviews")) {
    await db.createCollection("reviews")
    await db.collection("reviews").createIndex({ campaignId: 1 })
    await db.collection("reviews").createIndex({ reviewerId: 1 })
    await db.collection("reviews").createIndex({ createdAt: -1 })
  }

  console.log("Database collections initialized")
}

// User operations
export async function createUser(userData) {
  const { db } = await connectToDatabase()
  const result = await db.collection("users").insertOne({
    ...userData,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return result.insertedId
}

export async function getUserByEmail(email) {
  const { db } = await connectToDatabase()
  return db.collection("users").findOne({ email })
}

export async function getUserById(id) {
  const { db } = await connectToDatabase()
  const { ObjectId } = await import("mongodb")
  return db.collection("users").findOne({ _id: new ObjectId(id) })
}

export async function updateUser(id, updates) {
  const { db } = await connectToDatabase()
  const { ObjectId } = await import("mongodb")
  const result = await db
    .collection("users")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" },
    )
  return result.value
}

// Campaign operations
export async function createCampaign(campaignData) {
  const { db } = await connectToDatabase()
  const result = await db.collection("campaigns").insertOne({
    ...campaignData,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return result.insertedId
}

export async function getCampaignById(id) {
  const { db } = await connectToDatabase()
  const { ObjectId } = await import("mongodb")
  return db.collection("campaigns").findOne({ _id: new ObjectId(id) })
}

export async function getCampaigns(filter = {}, limit = 20, skip = 0) {
  const { db } = await connectToDatabase()
  return db.collection("campaigns").find(filter).sort({ createdAt: -1 }).limit(limit).skip(skip).toArray()
}

export async function getCampaignCount(filter = {}) {
  const { db } = await connectToDatabase()
  return db.collection("campaigns").countDocuments(filter)
}

export async function updateCampaign(id, updates) {
  const { db } = await connectToDatabase()
  const { ObjectId } = await import("mongodb")
  const result = await db
    .collection("campaigns")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" },
    )
  return result.value
}

// Investment operations
export async function createInvestment(investmentData) {
  const { db } = await connectToDatabase()
  const result = await db.collection("investments").insertOne({
    ...investmentData,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return result.insertedId
}

export async function getInvestmentById(id) {
  const { db } = await connectToDatabase()
  const { ObjectId } = await import("mongodb")
  return db.collection("investments").findOne({ _id: new ObjectId(id) })
}

export async function getInvestments(filter = {}, limit = 20, skip = 0) {
  const { db } = await connectToDatabase()
  return db.collection("investments").find(filter).sort({ createdAt: -1 }).limit(limit).skip(skip).toArray()
}

export async function updateInvestment(id, updates) {
  const { db } = await connectToDatabase()
  const { ObjectId } = await import("mongodb")
  const result = await db
    .collection("investments")
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" },
    )
  return result.value
}

// Review operations
export async function createReview(reviewData) {
  const { db } = await connectToDatabase()
  const result = await db.collection("reviews").insertOne({
    ...reviewData,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return result.insertedId
}

export async function getReviews(filter = {}) {
  const { db } = await connectToDatabase()
  return db.collection("reviews").find(filter).sort({ createdAt: -1 }).toArray()
}
