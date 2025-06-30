import { createConfig, http } from "wagmi"
import { mainnet, sepolia } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"

// Create wagmi config
export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: "YOUR_WALLET_CONNECT_PROJECT_ID", // Replace with your WalletConnect project ID
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})
