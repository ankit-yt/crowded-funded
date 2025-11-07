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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navbar */}
      <nav className="bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50 fixed top-0 left-0 w-full z-50">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
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
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
          Empowering{" "}
          <span className="bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
            Campus Innovators
          </span>{" "}
          Through Funding & Mentorship
        </h1>
        <p className="text-xl text-slate-300 mt-6">
          CrowdFund Campus is a next-generation platform connecting student entrepreneurs with investors who believe in
          their ideas. Build, fund, and scale your campus startup — all in one place.
        </p>

        <div className="mt-10 flex gap-6 justify-center">
          {!isLoggedIn && (
            <>
              <Link
                href="/register"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition transform hover:scale-105"
              >
                Start Your Journey
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border border-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700/50 transition"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-800/30 py-16 border-y border-slate-700/50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 text-center gap-10">
          <div>
            <h3 className="text-4xl font-bold text-blue-400">500+</h3>
            <p className="text-slate-400">Active Student Startups</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-indigo-400">$1.2M+</h3>
            <p className="text-slate-400">Fake Sandbox Funds Invested</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-emerald-400">50+</h3>
            <p className="text-slate-400">Partner Colleges</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Why Choose CrowdFund Campus?</h2>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-blue-500 transition">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg mb-4"></div>
            <h3 className="text-2xl font-semibold mb-2">For Entrepreneurs</h3>
            <p className="text-slate-400">
              Build your startup profile, pitch your idea, and attract investors. Track your funding journey with live
              progress visualization.
            </p>
          </div>
          <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-emerald-500 transition">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg mb-4"></div>
            <h3 className="text-2xl font-semibold mb-2">For Investors</h3>
            <p className="text-slate-400">
              Discover high-potential student startups, invest fake sandbox funds, and simulate real-world portfolio
              growth.
            </p>
          </div>
          <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-pink-500 transition">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg mb-4"></div>
            <h3 className="text-2xl font-semibold mb-2">For Institutions</h3>
            <p className="text-slate-400">
              Empower your students by providing them a gateway to funding, mentorship, and exposure to a thriving
              ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-800/30 border-y border-slate-700/50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Sign Up", desc: "Register as an Entrepreneur or Investor." },
              { step: "2", title: "Create or Discover", desc: "Entrepreneurs launch startups; Investors explore campaigns." },
              { step: "3", title: "Invest & Track", desc: "Fake sandbox investments simulate real-world experience." },
              { step: "4", title: "Grow Together", desc: "Achieve milestones and celebrate success with your community." },
            ].map((item) => (
              <div
                key={item.step}
                className="p-6 bg-slate-800/60 border border-slate-700 rounded-xl hover:border-blue-500 transition"
              >
                <div className="text-4xl font-bold text-blue-500 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              name: "Aarav Mehta",
              role: "Student Founder @ EcoPack",
              quote:
                "CrowdFund Campus helped me connect with investors and mentors who believed in my vision. My idea went from concept to prototype in 3 months!",
            },
            {
              name: "Priya Sharma",
              role: "Angel Investor",
              quote:
                "It’s a brilliant initiative — the fake investment sandbox gave me hands-on experience in evaluating startups before real-world funding.",
            },
            {
              name: "Rahul Kumar",
              role: "Incubator Head, PCTE",
              quote:
                "An inspiring platform for students! It bridges the gap between innovation and opportunity on campus.",
            },
          ].map((t) => (
            <div key={t.name} className="bg-slate-800/60 border border-slate-700 p-8 rounded-xl">
              <p className="text-slate-300 italic mb-4">“{t.quote}”</p>
              <h4 className="font-bold text-white">{t.name}</h4>
              <p className="text-slate-400 text-sm">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Start Your Startup Journey?</h2>
        <p className="text-lg text-slate-200 mb-8">
          Join the fastest-growing campus startup ecosystem today — build, invest, and innovate!
        </p>
        <Link
          href="/register"
          className="px-10 py-4 bg-white text-blue-700 font-bold rounded-lg hover:bg-slate-100 transition"
        >
          Get Started Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-8 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} CrowdFund Campus — All rights reserved.
      </footer>
    </div>
  )
}
