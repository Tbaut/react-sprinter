import { createAppKit } from '@reown/appkit/react'

import { WagmiProvider } from 'wagmi'
import {
  sepolia,
  b3Sepolia,
  baseSepolia,
  AppKitNetwork
} from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://cloud.reown.com
const projectId = 'b079b456fc21a5a1ff63574425469cd1'

// 2. Create a metadata object - optional
const metadata = {
  name: 'Sprinter PoC',
  description: 'Example app for Sprinter SDK and Sprinter React hooks',
  url: 'https://docs.sprinter.buildwithsygma.com/', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png']
}

// 3. Set the networks
const networks = [sepolia, b3Sepolia, baseSepolia] as [
  AppKitNetwork,
  ...AppKitNetwork[]
]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false
})

// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: false,
    swaps: false,
    onramp: false,
    socials: false,
    email: false,
    send: false
  }
})

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
