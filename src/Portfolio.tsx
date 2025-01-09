import {
  useSprinterBalances,
  useSprinterChains,
  useSprinterTokens
} from '@chainsafe/sprinter-react'
import { useAppKitAccount } from '@reown/appkit/react'
import { useEffect, useMemo } from 'react'
import { Button } from './components/ui/button'
import { formatBalance } from './utils'
import arrow from './assets/arrow.svg'
import sweep from './assets/sweep.svg'

export const Portofolio = () => {
  const { address } = useAppKitAccount()
  const { tokens: uncompleteTokens, getAvailableTokens } = useSprinterTokens()
  const { chains, getAvailableChains } = useSprinterChains()

  // @ts-expect-error address is defined
  const { balances, getUserBalances } = useSprinterBalances(address ?? '')
  const tokens = useMemo(() => {
    return {
      ...uncompleteTokens,
      data: uncompleteTokens.data?.concat({
        addresses: [],
        decimals: 18,
        name: 'ethereum',
        symbol: 'ETH',
        logoURI: 'https://scan.buildwithsygma.com/assets/icons/evm.svg'
      })
    }
  }, [uncompleteTokens])

  useEffect(() => {
    getAvailableTokens() // Fetch tokens on component mount
  }, [getAvailableTokens])

  useEffect(() => {
    getAvailableChains()
  }, [getAvailableChains])

  useEffect(() => {
    getUserBalances()
  }, [getUserBalances])

  if (tokens.loading) return <div>Loading tokens...</div>
  if (tokens.error) return <div>Error: {tokens.error}</div>

  return (
    <div className="mt-12 w-full px-48">
      {/* <div className="text-lg">Balance:</div>
    <div className="text-4xl font-semibold">$1,234,567</div>
    <div className="mb-16 mt-8 h-px w-full bg-separator-gradient"></div> */}
      <div className="pb-6 text-2xl">Portfolio:</div>
      <div className="grid grid-cols-4 gap-4 px-4">
        <div className="flex items-end text-sm font-medium">
          Asset <img src={arrow} />
        </div>
        <div className="flex items-end text-sm font-medium">
          Total balance <img src={arrow} />
        </div>
        <div className="flex items-end text-sm font-medium">
          Distribution <img src={arrow} />
        </div>
        <div />
        {Object.entries(balances.data ?? {}).map(([tokenId, balance]) => {
          const token = tokens.data?.find((t) => t.symbol === tokenId)
          if (!token) return

          return (
            <div
              key={tokenId}
              className="col-span-4 grid grid-cols-subgrid gap-4"
            >
              <div className="flex h-12 items-center">
                <img
                  className="mr-2 w-6"
                  src={token.logoURI}
                  alt={token.symbol}
                />
                {token.symbol}
              </div>
              <div className="flex items-center">
                {formatBalance(balance.total, token.decimals)} {token.symbol}
              </div>
              <div className="flex items-center">
                {balance.balances.map((b) => {
                  const relevantChains = chains.data?.filter(
                    (c) => c.chainID === b.chainId
                  )
                  return relevantChains?.map(({ logoURI }) => (
                    <img
                      key={b.chainId}
                      className="-ml-2 w-6"
                      src={logoURI}
                      alt={token.symbol}
                    />
                  ))
                })}
              </div>
              <div className="flex items-center">
                <Button variant={'outline'}>
                  <img src={sweep} /> Sweep
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
