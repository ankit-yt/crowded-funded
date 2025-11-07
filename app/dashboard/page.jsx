"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (!token || !userData) {
        router.push("/login")
        return
      }

      try {
        const data = JSON.parse(userData)
        setUser(data)

        // Route to role-specific dashboards
        if (data.role === "entrepreneur") {
          router.push("/dashboard/entrepreneur")
        } else if (data.role === "investor") {
          router.push("/dashboard/investor")
        } else if (data.role === "admin") {
          router.push("/admin")
        }
      } catch (error) {
        console.error("Dashboard routing error:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return null
}
