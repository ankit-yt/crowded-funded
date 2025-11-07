"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profileImage: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const res = await fetch("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error("Failed to fetch profile")
        const data = await res.json()
        setUser(data.user)
        setFormData({
          name: data.user.name || "",
          bio: data.user.bio || "",
          profileImage: data.user.profileImage || "",
        })
      } catch (error) {
        console.error("Failed to fetch profile:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to update profile")
      const data = await res.json()
      setUser(data.user)
      setEditing(false)
    } catch (error) {
      console.error("Failed to update profile:", error)
      alert("Failed to update profile")
    }
  }

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
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-700/50">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-4xl">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
              <p className="text-slate-400 capitalize">{user?.role}</p>
              <p className="text-slate-400 text-sm">{user?.email}</p>
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            {!editing ? (
              <>
                <div>
                  <label className="text-sm text-slate-400">Full Name</label>
                  <p className="text-xl text-white mt-1">{user?.name}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Email</label>
                  <p className="text-xl text-white mt-1">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-400">Bio</label>
                  <p className="text-xl text-white mt-1">{user?.bio || "No bio added yet"}</p>
                </div>
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Profile Image URL</label>
                  <input
                    type="url"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
