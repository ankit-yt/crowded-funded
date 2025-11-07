"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function InvestorDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)

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
        if (userData_parsed.role !== "investor") {
          router.push("/dashboard")
          return
        }

        setUser(userData_parsed)

        const res = await fetch("/api/dashboard/investor", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Failed to fetch dashboard")
        const data = await res.json()
        setStats(data.stats)
        setInvestments(data.investments)
      } catch (error) {
        console.error("Failed to fetch dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
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
            <div className="flex items-center gap-4">
              <Link href="/profile" className="px-4 py-2 text-white hover:bg-slate-700 rounded-lg transition">
                Profile
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("token")
                  localStorage.removeItem("user")
                  router.push("/")
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Investor Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 className="text-slate-400 text-sm font-medium mb-2">My Investments</h3>
            <p className="text-4xl font-bold text-white">{stats?.investmentCount || 0}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Total Invested</h3>
            <p className="text-4xl font-bold text-green-400">${(stats?.totalInvested || 0).toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
            <Link
              href="/campaigns"
              className="block h-full flex items-center justify-center text-center hover:bg-slate-700/50 rounded-lg transition"
            >
              <div>
                <p className="text-slate-400 text-sm font-medium mb-2">Explore More</p>
                <p className="text-2xl font-bold text-blue-400">Browse Campaigns</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Investments Table */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h2 className="text-xl font-bold text-white">My Investments</h2>
          </div>
          {investments.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-slate-400 mb-4">You haven't made any investments yet</p>
              <Link
                href="/campaigns"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition inline-block"
              >
                Start Investing
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Campaign</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((investment) => (
                    <tr key={investment._id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                      <td className="px-6 py-4">
                        <p className="text-white font-medium truncate">{investment.campaignTitle}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-bold">${investment.amount.toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm capitalize">
                          {investment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-400">{new Date(investment.createdAt).toLocaleDateString()}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
