"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { useAuth } from "../lib/auth-context";
import { Sidebar } from "./sidebar";
import { ModeToggle } from "./mode-toggle";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative flex flex-1 flex-col overflow-y-auto"
      >
        <header className="sticky top-0 z-10 flex h-16 items-center justify-end border-b border-border bg-background/80 px-6 backdrop-blur-sm">
          <ModeToggle />
        </header>
        <main className="flex-1 p-6">{children}</main>
      </motion.div>
    </div>
  )
}
