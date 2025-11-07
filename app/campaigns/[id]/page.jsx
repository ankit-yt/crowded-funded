"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function CampaignDetail() {
  const params = useParams()
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
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

    if (params.id) fetchCampaign()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!campaign) {
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

  const progressPercent = Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100)

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
              <Link href="/campaigns" className="px-4 py-2 text-white hover:bg-slate-700 rounded-lg transition">
                All Campaigns
              </Link>
              <Link href="/dashboard" className="px-4 py-2 text-white hover:bg-slate-700 rounded-lg transition">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Image */}
       

        {/* Campaign Info */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">{campaign.title}</h1>
          <p className="text-slate-400 mb-6 text-lg">{campaign.description}</p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400">Funding Progress</span>
              <span className="text-2xl font-bold text-white">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-400 to-indigo-600 h-3 rounded-full transition"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Raised</p>
              <p className="text-2xl font-bold text-white">${campaign.currentAmount.toLocaleString()}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Target</p>
              <p className="text-2xl font-bold text-white">${campaign.targetAmount.toLocaleString()}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-1">Investors</p>
              <p className="text-2xl font-bold text-white">{campaign.investorCount}</p>
            </div>
          </div>

          {/* Action Button */}
          <Link
  href={`/campaigns/${params.id}/invest`}
  className="w-full md:w-auto inline-block text-center px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition"
>
  Invest Now
</Link>

        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Campaign Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400">Category</span>
                <span className="text-white capitalize">{campaign.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status</span>
                <span className="text-white capitalize">{campaign.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Created</span>
                <span className="text-white">{new Date(campaign.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">About the Entrepreneur</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full"></div>
              <div>
                <p className="text-white font-semibold">Entrepreneur</p>
                <p className="text-slate-400 text-sm">View profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
