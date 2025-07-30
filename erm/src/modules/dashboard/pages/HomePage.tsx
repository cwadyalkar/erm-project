"use client"

import { useAuth } from "@/modules/auth/hooks/useAuth"
import { LoginForm } from "@/modules/auth/Login"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/dashboard")
    }
  }, [user, isLoading, navigate])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return <LoginForm />
}
