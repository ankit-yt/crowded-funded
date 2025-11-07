"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(`/api/campaigns?page=${page}&limit=12`)
        const data = await res.json()
        setCampaigns(data.campaigns)
        setTotalPages(data.pagination.pages)
      } catch (error) {
        console.error("Failed to fetch campaigns:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [page])

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
              <Link href="/" className="px-4 py-2 text-white hover:bg-slate-700 rounded-lg transition">
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Active Campaigns</h1>
          <p className="text-slate-400">Discover and support innovative startups</p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No campaigns available yet</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {campaigns.map((campaign) => (
                <Link key={campaign._id} href={`/campaigns/${campaign._id}`}>
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden hover:border-slate-600/80 transition cursor-pointer group">
                    <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-600 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition flex items-center justify-center">
                      <span className="text-6xl opacity-20">📈</span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{campaign.title}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{campaign.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-white font-semibold">
                            {campaign.targetAmount > 0
                              ? Math.round((campaign.currentAmount / campaign.targetAmount) * 100)
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-indigo-600 h-2 rounded-full transition"
                            style={{
                              width: `${Math.min((campaign.currentAmount / campaign.targetAmount) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm pt-2">
                          <span className="text-slate-400">${campaign.currentAmount.toLocaleString()}</span>
                          <span className="text-slate-400">of ${campaign.targetAmount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-2 rounded-lg transition ${
                      page === p ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
