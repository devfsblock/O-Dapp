"use client"

import { wagmiAdapter, projectId } from "@/config"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createAppKit } from "@reown/appkit/react"
import { mainnet, arbitrum , polygon, bsc,base, bscTestnet } from "@reown/appkit/networks"
import type { ReactNode } from "react"
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi"

// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error("Project ID is not defined")
}

// Set up metadata
const metadata = {
  name: "OanicAI Dashboard",
  description: "OanicAI Dashboard Web3 Application",
  url: "http://localhost:3000", // origin must match your domain & subdomain
  icons: ["/images/logo1.svg", "/favicon.svg"],
}

// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, polygon, bsc,base, bscTestnet],
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email:false,
    socials:false
  },
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider
