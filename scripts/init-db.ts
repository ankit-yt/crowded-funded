import { MongoClient } from "mongodb"

async function initializeDatabase() {
  const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017")

  try {
    await client.connect()
    const db = client.db("crowdfund-campus")

    // Create collections with validation
    const collections = ["users", "campaigns", "investments", "reviews"]

    for (const collection of collections) {
      const exists = await db.listCollections({ name: collection }).toArray()
      if (exists.length === 0) {
        await db.createCollection(collection)
        console.log(`Created collection: ${collection}`)
      }
    }

    // Create indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("campaigns").createIndex({ userId: 1 })
    await db.collection("campaigns").createIndex({ status: 1 })
    await db.collection("investments").createIndex({ campaignId: 1 })
    await db.collection("investments").createIndex({ investorId: 1 })

    console.log("Database initialized successfully")
  } finally {
    await client.close()
  }
}

initializeDatabase().catch(console.error)
