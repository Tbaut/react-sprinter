import { DialogHeader, Dialog, DialogContent, DialogTitle } from './ui/dialog'

import sweep from '../assets/sweep.svg'
import { useTokens } from '@/hooks/useTokens'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { StructuredTokenData } from '@/context/ChainTokensContext'
import { useSprinterTransfers } from '@chainsafe/sprinter-react'
import { ElementSelect } from './ElementSelect'
import { Button } from './ui/button'
import { formatBalance } from '@/utils'
import {
  isSupportedToken,
  priceToBigInt,
  useCoinPrice
} from '@/hooks/useCoinPrice'
import { useAppKitAccount } from '@reown/appkit/react'

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
  const { address } = useAppKitAccount()
  const { getSweep } = useSprinterTransfers()
  const { tokens } = useTokens()
  const { prices } = useCoinPrice()
  const [selectedChains, setSelectedChains] = useState<string[]>([])
  const selectedToken = useMemo(() => {
    return tokens.find((token) => token.symbol === tokenId)
  }, [tokenId, tokens])
  const totalAmount = useMemo(() => {
    if (!tokenId || !structuredTokenData[tokenId].chainBalances) return 0n

    let res = 0n
    structuredTokenData[tokenId].chainBalances
      .filter((c) => selectedChains.includes(c.chain.chainID.toString()))
      .forEach((c) => {
        res += BigInt(c.balance)
      })

    return res
  }, [selectedChains, structuredTokenData, tokenId])

  const totalAmountUSD = useMemo(() => {
    if (totalAmount === 0n || !tokenId || !prices || !selectedToken) return 0
    const price = isSupportedToken(tokenId) ? prices[tokenId]?.price : 0

    return (
      (BigInt(totalAmount) * priceToBigInt(price)) /
      10n ** BigInt(selectedToken?.decimals)
    )
  }, [totalAmount, tokenId, prices, selectedToken])

  const possibleSweepingChains = useMemo(
    () =>
      tokenId
        ? structuredTokenData[tokenId].chainBalances?.map((c) => c.chain)
        : [],
    [structuredTokenData, tokenId]
  )

  useEffect(() => {
    setSelectedChains(
      possibleSweepingChains?.map((c) => c.chainID.toString()) ?? []
    )
  }, [possibleSweepingChains])

  const onSweep = useCallback(() => {
    if (!selectedToken || !address || !tokenId) return

    getSweep({
      account: address,
      destinationChain: Number(selectedChains[0]),
      token: tokenId,
      sourceChains: possibleSweepingChains?.map((c) => c.chainID) ?? undefined
    })
  }, [
    selectedToken,
    address,
    tokenId,
    getSweep,
    selectedChains,
    possibleSweepingChains
  ])

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
          <div className="text-sm font-normal">Token</div>
          <div className="flex h-12 items-center">
            <img
              className="mr-2 w-6"
              src={selectedToken.logoURI}
              alt={selectedToken.symbol}
            />
            {selectedToken.symbol}
          </div>
          <div className="text-sm font-normal">Sweeping from</div>
          <div className="grid grid-cols-3 gap-4">
            {possibleSweepingChains?.map((chain) => {
              const amount =
                structuredTokenData[selectedToken.symbol].chainBalances?.find(
                  (c) => c.chain.chainID === chain.chainID
                )?.balance ?? '0'
              return (
                <ElementSelect
                  key={chain.chainID}
                  id={chain.chainID.toString()}
                  logoURI={chain.logoURI}
                  isSelected={selectedChains.includes(chain.chainID.toString())}
                  amount={amount}
                  decimals={selectedToken.decimals}
                  onSelect={(id) => {
                    if (selectedChains.includes(id)) {
                      setSelectedChains((prev) => prev.filter((c) => c !== id))
                    } else {
                      setSelectedChains((prev) => [...prev, id])
                    }
                  }}
                  symbol={selectedToken.symbol}
                  withSymbol={true}
                  name={chain.name}
                />
              )
            })}
          </div>
          <div className="flex justify-between pt-6">
            <div className="text-sm font-normal">Total amount</div>
            <div className="flex flex-col">
              <div className="text-right text-sm font-normal">
                {formatBalance(
                  totalAmount.toString(),
                  selectedToken.decimals,
                  2
                )}{' '}
                {selectedToken.symbol}
              </div>
              <div className="text-right text-sm font-light text-gray-500">
                ${totalAmountUSD} USD
              </div>
            </div>
          </div>
          <div className="pt-6">
            <Button onClick={onSweep} className="w-full" variant="secondary">
              Sweep
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
