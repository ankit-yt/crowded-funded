"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [campaignStats, setCampaignStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

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
        if (userData_parsed.role !== "admin") {
          router.push("/dashboard")
          return
        }

        setUser(userData_parsed)

        const res = await fetch("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Failed to fetch admin dashboard")
        const data = await res.json()
        setStats(data.stats)
        setCampaignStats(data.campaignStatus)
      } catch (error) {
        console.error("Failed to fetch admin dashboard:", error)
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
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg"></div>
              <span className="font-bold text-white text-xl">Admin Panel</span>
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
        <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === "overview"
                ? "bg-purple-600 text-white"
                : "bg-slate-800/50 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("campaigns")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === "campaigns"
                ? "bg-purple-600 text-white"
                : "bg-slate-800/50 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === "users" ? "bg-purple-600 text-white" : "bg-slate-800/50 text-slate-300 hover:bg-slate-700"
            }`}
          >
            Users
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Total Users</h3>
                <p className="text-4xl font-bold text-white">{stats?.totalUsers || 0}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Total Campaigns</h3>
                <p className="text-4xl font-bold text-white">{stats?.totalCampaigns || 0}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Total Transactions</h3>
                <p className="text-4xl font-bold text-blue-400">{stats?.totalTransactions || 0}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Platform Volume</h3>
                <p className="text-4xl font-bold text-green-400">${(stats?.totalVolume || 0).toLocaleString()}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Funded Campaigns</h3>
                <p className="text-4xl font-bold text-emerald-400">{stats?.fundedCampaigns || 0}</p>
              </div>
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <h3 className="text-slate-400 text-sm font-medium mb-2">Active Campaigns</h3>
                <p className="text-4xl font-bold text-orange-400">{stats?.activeCampaigns || 0}</p>
              </div>
            </div>

            {/* Campaign Status Distribution */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-6">Campaign Status Distribution</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Active</p>
                  <p className="text-3xl font-bold text-blue-400">{campaignStats?.active || 0}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Funded</p>
                  <p className="text-3xl font-bold text-green-400">{campaignStats?.funded || 0}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Closed</p>
                  <p className="text-3xl font-bold text-yellow-400">{campaignStats?.closed || 0}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Failed</p>
                  <p className="text-3xl font-bold text-red-400">{campaignStats?.failed || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === "campaigns" && <AdminCampaignsList />}

        {/* Users Tab */}
        {activeTab === "users" && <AdminUsersList />}
      </div>
    </div>
  )
}

function AdminCampaignsList() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("/api/admin/campaigns?limit=50", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setCampaigns(data.campaigns)
      } catch (error) {
        console.error("Failed to fetch campaigns:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  const handleStatusChange = async () => {
    if (!selectedCampaign || !newStatus) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`/api/admin/campaigns/${selectedCampaign._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) throw new Error("Failed to update")
      const data = await res.json()

      setCampaigns(campaigns.map((c) => (c._id === selectedCampaign._id ? data.campaign : c)))
      setSelectedCampaign(null)
      setNewStatus("")
    } catch (error) {
      console.error("Failed to update campaign status:", error)
      alert("Failed to update status")
    }
  }

  if (loading) {
    return <div className="text-center text-slate-400">Loading...</div>
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700/50">
        <h2 className="text-xl font-bold text-white">All Campaigns</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Campaign</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Target</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Raised</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Action</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign._id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                <td className="px-6 py-4">
                  <p className="text-white font-medium truncate">{campaign.title}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-white">${campaign.targetAmount.toLocaleString()}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-green-400 font-bold">${campaign.currentAmount.toLocaleString()}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm capitalize">
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      setSelectedCampaign(campaign)
                      setNewStatus(campaign.status)
                    }}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700/50 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-white mb-4">Update Campaign Status</h3>
            <p className="text-slate-400 mb-4">{selectedCampaign.title}</p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white mb-4 focus:outline-none focus:border-purple-500"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="funded">Funded</option>
              <option value="closed">Closed</option>
              <option value="failed">Failed</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={handleStatusChange}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
              >
                Save
              </button>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminUsersList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch("/api/admin/users?limit=50", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setUsers(data.users)
      } catch (error) {
        console.error("Failed to fetch users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return <div className="text-center text-slate-400">Loading...</div>
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-700/50">
        <h2 className="text-xl font-bold text-white">All Users ({users.length})</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-white">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition">
                <td className="px-6 py-4">
                  <p className="text-white font-medium">{user.name}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-slate-400">{user.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm capitalize">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-slate-400">{new Date(user.createdAt).toLocaleDateString()}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
