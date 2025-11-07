"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Home() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const res = await fetch("/api/auth/verify", {
            headers: { Authorization: `Bearer ${token}` },
          })
          setIsLoggedIn(res.ok)
          if (res.ok) {
            const data = await res.json()
            localStorage.setItem("user", JSON.stringify(data.user))
          }
        } catch (error) {
          console.error("Auth check failed:", error)
          setIsLoggedIn(false)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg"></div>
              <span className="font-bold text-white text-xl">CrowdFund Campus</span>
            </div>
            <div className="flex gap-4">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="px-4 py-2 text-white hover:bg-slate-700 rounded-lg transition">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem("token")
                      localStorage.removeItem("user")
                      setIsLoggedIn(false)
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-2 text-white hover:bg-slate-700 rounded-lg transition">
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            Connect. Fund.{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">Innovate</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            CrowdFund Campus is the ultimate platform connecting ambitious entrepreneurs with forward-thinking
            investors. Launch your startup, grow your portfolio, or discover the next unicorn.
          </p>

          {!isLoggedIn && (
            <div className="flex gap-4 justify-center pt-4">
              <Link
                href="/register"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-105"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border border-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700/50 transition"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8 hover:border-slate-600/80 transition">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-2">For Entrepreneurs</h3>
            <p className="text-slate-400">
              Showcase your innovative ideas and connect with investors ready to fund your vision.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8 hover:border-slate-600/80 transition">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-2">For Investors</h3>
            <p className="text-slate-400">
              Discover promising startups and grow your investment portfolio with calculated risks.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-8 hover:border-slate-600/80 transition">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg mb-4"></div>
            <h3 className="text-xl font-bold text-white mb-2">Community Driven</h3>
            <p className="text-slate-400">
              Join a vibrant community of founders, investors, and mentors shaping the future.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
