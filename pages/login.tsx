"use client"

import { useEffect, useState } from "react"
import InvitationCodeScreen from "../components/invitation-code-screen"
import { useRouter } from "next/router"
import { motion } from "framer-motion"
import { useAuth } from "../lib/auth-context"
// import { GlowingStarsBackground } from "../components/ui/glowing-stars-background"
import { MagneticButton } from "../components/ui/magnetic-button"
import { useUserProfile } from '@/hooks/useUserProfile'
import { useAccount } from 'wagmi'



export default function Login() {
  const router = useRouter();
  const { isAuthenticated, connectWallet, isConnecting, walletAddress } = useAuth();
  const { address } = useAccount();
  const { user, isLoading } = useUserProfile();
  useEffect(() => {
    // If already authenticated, check user profile
    if (isAuthenticated && address) {
      if (!isLoading && (!user || !user.username || !user.email || !user.userType)) {
        router.push('/signup');
      } else if (!isLoading && user) {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, address, user, isLoading, router]);

  // Only show login if invitationVerified is set
  if (typeof window !== "undefined" && localStorage.getItem("invitationVerified") !== "true") {
    router.replace("/invitationCode");
    return null;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* <GlowingStarsBackground /> */}
      <div className="flex h-full w-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-xl border border-gray-800 bg-black/50 p-8 backdrop-blur-xl"
        >
          <div className="mb-8 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-2 flex justify-center"
            >
              <img src="/images/logo1.svg" alt="OanicAI Logo" className="h-12" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-gray-400"
            >
              Connect your wallet to continue
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex justify-center"
          >
            <MagneticButton>
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 px-8 py-3 font-medium text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70"
              >
                <span className="relative z-10">{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
                <span className="absolute inset-0 z-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </button>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
