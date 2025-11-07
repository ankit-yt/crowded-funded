"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function InvestPage() {
  const params = useParams()
  const router = useRouter()
  const [campaign, setCampaign] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [amount, setAmount] = useState("")
  const [investing, setInvesting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        const userData = localStorage.getItem("user")

        if (!token || !userData) {
          router.push("/login")
          return
        }

        const userData_parsed = JSON.parse(userData)
        setUser(userData_parsed)

        if (userData_parsed.role === "entrepreneur") {
          router.push(`/campaigns/${params.id}`)
          return
        }

        const res = await fetch(`/api/campaigns/${params.id}`)
        if (!res.ok) throw new Error("Campaign not found")
        const data = await res.json()
        setCampaign(data.campaign)
      } catch (error) {
        console.error("Failed to fetch campaign:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) fetchData()
  }, [params.id, router])

  const handleInvest = async (e) => {
    e.preventDefault()
    setError("")
    setInvesting(true)

    if (!amount || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      setInvesting(false)
      return
    }

    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/investments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          campaignId: params.id,
          amount: Number.parseFloat(amount),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Investment failed")
        setInvesting(false)
        return
      }

      router.push(`/investments/${data.investmentId}`)
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
      setInvesting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!campaign || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <nav className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg"></div>
                <span className="font-bold text-white text-xl">CrowdFund Campus</span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-slate-400 text-lg">Campaign not found</p>
          <Link href="/campaigns" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
            Back to campaigns
          </Link>
        </div>
      </div>
    )
  }

  const remainingAmount = Math.max(0, campaign.targetAmount - campaign.currentAmount)
  const recommendedInvestment = Math.min(remainingAmount, 10000)

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
              <Link
                href={`/campaigns/${params.id}`}
                className="px-4 py-2 text-white hover:bg-slate-700 rounded-lg transition"
              >
                Back
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Invest in {campaign.title}</h1>
          <p className="text-slate-400">Secure your stake in this promising startup</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Campaign Summary */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Campaign Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">Target Amount</p>
                <p className="text-2xl font-bold text-white">${campaign.targetAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Already Raised</p>
                <p className="text-2xl font-bold text-white">${campaign.currentAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Remaining</p>
                <p className="text-2xl font-bold text-green-400">${remainingAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Total Investors</p>
                <p className="text-2xl font-bold text-white">{campaign.investorCount}</p>
              </div>
            </div>
          </div>

          {/* Investment Form */}
          <form onSubmit={handleInvest} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Make Investment</h3>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Investment Amount ($)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="100"
                  step="100"
                  required
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  placeholder="Enter amount"
                />
                <p className="text-slate-400 text-xs mt-1">Minimum: $100</p>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-3">
                <p className="text-slate-400 text-sm mb-2">Quick Options</p>
                <div className="grid grid-cols-3 gap-2">
                  {[500, 1000, 5000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val.toString())}
                      className="py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded-lg transition"
                    >
                      ${val.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {amount && (
                <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3">
                  <p className="text-green-400 text-sm">
                    You will invest: ${Number.parseFloat(amount).toLocaleString()}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={investing || !amount}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50"
              >
                {investing ? "Processing..." : "Confirm Investment"}
              </button>
            </div>
          </form>
        </div>

        {/* Information */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">How Investments Work</h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex gap-3">
              <span className="text-blue-400 font-bold">1.</span>
              <span>Submit your investment amount and confirm the transaction</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400 font-bold">2.</span>
              <span>Your funds are recorded in the campaign ledger immediately</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400 font-bold">3.</span>
              <span>Track your investment status and campaign progress from your dashboard</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-400 font-bold">4.</span>
              <span>When the campaign reaches its goal, funds are transferred to the entrepreneur</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
