import { useSprinterTransfers } from '@chainsafe/sprinter-react'
import { useEffect } from 'react'

export const Content = () => {
  const { solution, getPoolAssetOnDestination } = useSprinterTransfers()

  useEffect(() => {
    const settings = {
      account: '0xYourAddress',
      destinationChain: 11155111, // Sepolia Testnet
      token: 'USDC',
      amount: 1000000, // 1 USDC (smallest denomination)
      sourceChains: [84532, 1993] // Optional: source chains to consider
    }

    getPoolAssetOnDestination(settings) // Fetch transfer solution when the component mounts
  }, [getPoolAssetOnDestination])

  if (solution.loading) return <div>Loading transfer solution...</div>
  if (solution.error)
    return <div>Error fetching transfer solution: {solution.error}</div>

  return <div>Transfer Solution: {JSON.stringify(solution.data)}</div>
}
