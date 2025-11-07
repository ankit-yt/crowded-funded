"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function InvestmentConfirmation() {
  const params = useParams()
  const router = useRouter()
  const [investment, setInvestment] = useState(null)
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/investments/${params.id}`)
        if (!res.ok) throw new Error("Investment not found")
        const data = await res.json()
        setInvestment(data.investment)

        const campaignRes = await fetch(`/api/campaigns/${data.investment.campaignId}`)
        if (campaignRes.ok) {
          const campaignData = await campaignRes.json()
          setCampaign(campaignData.campaign)
        }
      } catch (error) {
        console.error("Failed to fetch investment:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) fetchData()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!investment) {
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
          <p className="text-slate-400 text-lg">Investment not found</p>
        </div>
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
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Investment Successful!</h1>
          <p className="text-slate-400">Your investment has been confirmed and recorded</p>
        </div>

        {/* Investment Details */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Investment Details</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-slate-400 text-sm mb-1">Investment ID</p>
              <p className="text-xl font-mono text-white break-all">{investment._id.toString()}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Transaction ID</p>
              <p className="text-xl font-mono text-white">{investment.transactionId}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Amount Invested</p>
              <p className="text-3xl font-bold text-green-400">${investment.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Status</p>
              <p className="text-xl font-bold text-green-400 capitalize">{investment.status}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-1">Date</p>
              <p className="text-xl text-white">{new Date(investment.createdAt).toLocaleDateString()}</p>
            </div>
            {campaign && (
              <div>
                <p className="text-slate-400 text-sm mb-1">Campaign</p>
                <Link href={`/campaigns/${campaign._id}`} className="text-xl text-blue-400 hover:text-blue-300">
                  {campaign.title}
                </Link>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="border-t border-slate-700/50 pt-8">
            <h3 className="text-xl font-bold text-white mb-4">What Happens Next?</h3>
            <ul className="space-y-3 text-slate-300">
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">•</span>
                <span>Your investment is now active and contributing to the campaign goal</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">•</span>
                <span>You'll receive updates as the campaign progresses</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-400 font-bold">•</span>
                <span>View all your investments from your investor dashboard</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition text-center"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/campaigns"
            className="flex-1 px-6 py-3 border border-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700/50 transition text-center"
          >
            Explore More Campaigns
          </Link>
        </div>
      </div>
    </div>
  )
}
