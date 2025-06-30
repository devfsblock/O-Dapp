"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation" // Note: using next/navigation for App Router
import { useAuth } from "../lib/auth-context"

export default function Page() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // Redirect based on authentication status
    if (isAuthenticated) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Show a loading state while redirecting
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Checking wallet connection...</p>
      </div>
    </div>
  )
}
