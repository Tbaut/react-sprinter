import {
  useSprinterBalances,
  useSprinterChains
} from '@chainsafe/sprinter-react'
import { useAppKitAccount } from '@reown/appkit/react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { formatBalance } from './utils'
import arrow from './assets/arrow.svg'
import sweep from './assets/sweep.svg'
import { SweepModal } from '@/components/SweepModal'
import { useTokens } from '@/hooks/useTokens'
import { Chain } from '@chainsafe/sprinter-sdk'
import { Chains } from './components/Chains'

export type ChainBalance = {
  chain: Chain
  balance: string
}

export type StructuredTokenData = Record<
  string,
  {
    name: string
    symbol: string
    decimals: number
    logoURI: string
    total: string
    chainBalances?: ChainBalance[]
  }
>

export const Portofolio = () => {
  const [sweepModalOpen, setSweepModalOpen] = useState(false)
  const [tokenToSweep, setTokenToSweep] = useState('')
  const { address } = useAppKitAccount()
  const { chains, getAvailableChains } = useSprinterChains()
  const { error, isLoading, tokens } = useTokens()
  // @ts-expect-error address is defined
  const { balances, getUserBalances } = useSprinterBalances(address ?? '')
  const structuredTokenData = useMemo(() => {
    const structuredRes: StructuredTokenData = {}

    Object.entries(balances.data ?? {}).forEach(([tokenId, balance]) => {
      const token = tokens.find((t) => t.symbol === tokenId)
      if (!token) return
      structuredRes[tokenId] = {
        ...token,
        total: balance.total,
        chainBalances: []
      }

      balance.balances.forEach((eachBalance) => {
        if (eachBalance.balance === '0') return

        const relevantChains = chains.data?.filter(
          (chain) => chain.chainID === eachBalance.chainId
        )

        relevantChains?.forEach((chain) => {
          structuredRes[tokenId].chainBalances?.push({
            chain,
            balance: eachBalance.balance
          })
        })
      })
    })

    return structuredRes
  }, [balances.data, chains.data, tokens])

  console.log('structuredTokenData', structuredTokenData)
  useEffect(() => {
    getAvailableChains()
  }, [getAvailableChains])

  useEffect(() => {
    getUserBalances()
  }, [getUserBalances])

  if (isLoading) return <div>Loading tokens...</div>
  if (error) return <div>Error: {error}</div>

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
        {Object.entries(structuredTokenData).map(
          ([tokenId, { symbol, decimals, logoURI, chainBalances, total }]) => {
            return (
              <div
                key={tokenId}
                className="col-span-4 grid grid-cols-subgrid gap-4"
              >
                <div className="flex h-12 items-center">
                  <img className="mr-2 w-6" src={logoURI} alt={symbol} />
                  {symbol}
                </div>
                <div className="flex items-center">
                  {formatBalance(total, decimals)} {symbol}
                </div>
                {(chainBalances ?? []).length > 0 && (
                  <Chains chainBalances={chainBalances} />
                )}
                <div className="flex items-center">
                  {total !== '0' && (
                    <Button
                      variant={'outline'}
                      onClick={() => {
                        setSweepModalOpen(true)
                        setTokenToSweep(tokenId)
                      }}
                    >
                      <img src={sweep} /> Sweep
                    </Button>
                  )}
                </div>
              </div>
            )
          }
        )}
      </div>
      <SweepModal
        open={sweepModalOpen}
        onOpenChange={(open) => {
          setSweepModalOpen(open)
          if (!open) setTokenToSweep('')
        }}
        tokenId={tokenToSweep}
        structuredTokenData={structuredTokenData}
      />
    </div>
  )
}
