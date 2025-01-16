import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription
} from './ui/dialog'

import sweep from '../assets/sweep.svg'
import { useTokens } from '@/hooks/useTokens'
import { useEffect, useMemo, useState } from 'react'
import { StructuredTokenData } from '@/Portfolio'

type Props = {
  onOpenChange: (open: boolean) => void
  open: boolean
  tokenId?: string
  structuredTokenData: StructuredTokenData
}

export const SweepModal = ({
  onOpenChange,
  open,
  tokenId,
  structuredTokenData
}: Props) => {
  const { tokens } = useTokens()
  const selectedToken = useMemo(() => {
    return tokens.find((token) => token.symbol === tokenId)
  }, [tokenId, tokens])

  const possibleSweepingChains = useMemo(
    () =>
      tokenId
        ? structuredTokenData[tokenId].chainBalances?.map((c) => c.chain)
        : [],
    [structuredTokenData, tokenId]
  )
  const [selectedChains, setSelectedChains] = useState<string[]>([])

  useEffect(() => {
    setSelectedChains(
      possibleSweepingChains?.map((c) => c.chainID.toString()) ?? []
    )
  }, [possibleSweepingChains])

  if (!selectedToken) return

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <div className="mr-3 inline-flex h-10 items-center justify-center gap-2.5 overflow-hidden rounded-[999px] border border-[#e1e3e9] bg-white p-2.5">
              <img className="relative size-5 overflow-hidden" src={sweep} />{' '}
            </div>
            Sweep balance
          </DialogTitle>
          <div className="pt-5 text-sm font-medium">Token</div>
          <div className="flex h-12 items-center">
            <img
              className="mr-2 w-6"
              src={selectedToken.logoURI}
              alt={selectedToken.symbol}
            />
            {selectedToken.symbol}
          </div>
          <div className="pb-5 text-sm font-medium">Sweeping from</div>
          <div className="grid grid-cols-3 gap-4">
            {possibleSweepingChains?.map((chain) => (
              <div
                key={chain.chainID}
                className={`flex w-full cursor-pointer rounded-md border border-slate-300 px-4 py-2 outline-none transition-colors ${
                  selectedChains.includes(chain.chainID.toString())
                    ? 'bg-gray-500 text-white'
                    : 'bg-white text-black'
                }`}
                onClick={() => {
                  if (selectedChains.includes(chain.chainID.toString())) {
                    setSelectedChains((prev) =>
                      prev.filter((c) => c !== chain.chainID.toString())
                    )
                  } else {
                    setSelectedChains((prev) => [
                      ...prev,
                      chain.chainID.toString()
                    ])
                  }
                }}
              >
                <img
                  src={chain.logoURI}
                  alt={chain.name}
                  className="mr-2 w-5"
                />
                <span className="truncate">{chain.name}</span>
              </div>
            ))}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
