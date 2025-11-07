"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CreateCampaign() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    deadline: "",
    category: "technology",
    image: "",
  })

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (!token || !userData) {
        router.push("/login")
        return
      }

      try {
        const res = await fetch("/api/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Auth failed")
        const data = await res.json()
        setUser(data.user)

        if (data.user.role !== "entrepreneur" && data.user.role !== "admin") {
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create campaign")
        setLoading(false)
        return
      }

      router.push(`/campaigns/${data.campaignId}`)
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Navbar */}
      <nav className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg"></div>
              <span className="font-bold text-white text-xl">CrowdFund Campus</span>
            </Link>
            <div className="flex gap-4">
              <Link href="/dashboard" className="px-4 py-2 text-white hover:bg-slate-700 rounded-lg transition">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Create a New Campaign</h1>
          <p className="text-slate-400">Share your innovation and inspire investors</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-white mb-2">Campaign Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              placeholder="Your innovative startup idea"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              placeholder="Describe your campaign in detail..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Target Amount ($)</label>
              <input
                type="number"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                required
                min="1000"
                step="1000"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                placeholder="50000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
            >
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="fintech">FinTech</option>
              <option value="edtech">EdTech</option>
              <option value="ecommerce">E-Commerce</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Campaign Image URL (optional)</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50"
            >
              {loading ? "Creating Campaign..." : "Create Campaign"}
            </button>
            <Link
              href="/dashboard"
              className="flex-1 py-2 border border-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700/50 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
