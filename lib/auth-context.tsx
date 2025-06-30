"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useAccount, useDisconnect } from "wagmi"
import { modal } from "../context"

interface AuthContextType {
  isAuthenticated: boolean
  walletAddress: string | null
  chainId: number | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  isConnecting: boolean
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  walletAddress: null,
  chainId: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnecting: false,
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { address, isConnected } = useAccount()
  const chain = null // Replace this with the appropriate logic to get the chain ID
  const { disconnect } = useDisconnect()
  const [isConnecting, setIsConnecting] = useState(false)

  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      await modal.open()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    try {
      disconnect()
    } catch (error) {
      console.error("Failed to disconnect wallet:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isConnected,
        walletAddress: address || null,
        chainId: null, // Update this to use the correct chain ID logic
        connectWallet,
        disconnectWallet,
        isConnecting,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
