import { DialogHeader, Dialog, DialogContent, DialogTitle } from '../ui/dialog'

import coin from '../../assets/coin.svg'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useChainTokens } from '@/context/ChainTokensContext'
import { formatBalance } from '@/utils'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { useSprinterTransfers } from '@chainsafe/sprinter-react'
import { useAppKitAccount } from '@reown/appkit/react'
import { Solution } from '@chainsafe/sprinter-sdk'
import { parseUnits } from 'viem'
import { SendContent } from './SendContent'
import { isSupportedToken, useCoinPrice } from '@/hooks/useCoinPrice'

type Props = {
  onOpenChange: (open: boolean) => void
  open: boolean
}

export const SendModal = ({ onOpenChange, open }: Props) => {
  const { structuredTokenData } = useChainTokens()
  const [selectedToken, setSelectedToken] = useState('')
  const [amount, setAmount] = useState('')
  const {
    getPoolAssetOnDestination,
    solution: {
      data: solutionData,
      error: solutionError,
      loading: solutionLoading
    }
  } = useSprinterTransfers()
  const [requestedQuotes, setRequestedQuotes] = useState(false)
  const { address } = useAppKitAccount()
  const [receivedSolutions, setReceivedsolutions] = useState<Solution[] | null>(
    null
  )
  const { prices } = useCoinPrice()
  const amountUSD = useMemo(() => {
    if (!prices || !selectedToken || !isSupportedToken(selectedToken)) return 0
    const amountNumber = Number(amount) || 0

    const price = prices[selectedToken].price ?? 0

    const roundedPrice = Math.round(Number(price))
    return (amountNumber * roundedPrice).toFixed(2)
  }, [amount, prices, selectedToken])

  console.log('solutionData', solutionData)

  const possibleSendingTokens = useMemo(
    () => Object.keys(structuredTokenData),
    [structuredTokenData]
  )
  const [step, setStep] = useState<'getQuotes' | 'send'>('getQuotes')

  useEffect(() => {
    if (!selectedToken) {
      const firstWithBalance = Object.entries(structuredTokenData).find(
        ([, data]) => data.total !== '0'
      )

      if (!firstWithBalance) return

      setSelectedToken(firstWithBalance[0])
    }
  }, [possibleSendingTokens, selectedToken, structuredTokenData])

  const onSetMax = useCallback(() => {
    if (!selectedToken) return

    const val = formatBalance(
      structuredTokenData[selectedToken].total,
      structuredTokenData[selectedToken].decimals
    )
    setAmount(val)
  }, [selectedToken, structuredTokenData])

  const onGetQuote = useCallback(() => {
    if (!address || !structuredTokenData[selectedToken].chainBalances?.[0])
      return

    setRequestedQuotes(true)
    setReceivedsolutions(null)

    const gweiAmount = parseUnits(
      amount,
      structuredTokenData[selectedToken].decimals
    )
    getPoolAssetOnDestination({
      account: address,
      destinationChain:
        structuredTokenData[selectedToken].chainBalances[0].chain.chainID,
      amount: gweiAmount,
      token: selectedToken
    })
  }, [
    address,
    amount,
    getPoolAssetOnDestination,
    selectedToken,
    structuredTokenData
  ])

  useEffect(() => {
    if (!solutionData || !Array.isArray(solutionData) || !requestedQuotes)
      return

    setStep('send')
    setReceivedsolutions(solutionData)
  }, [receivedSolutions, requestedQuotes, solutionData])

  const onGoBack = useCallback(() => {
    setStep('getQuotes')
    setRequestedQuotes(false)
    setReceivedsolutions(null)
  }, [])

  if (!selectedToken) return

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <div className="mr-3 inline-flex h-10 items-center justify-center gap-2.5 overflow-hidden rounded-[999px] border border-[#e1e3e9] bg-white p-2.5">
              <img className="relative size-5 overflow-hidden" src={coin} />{' '}
            </div>
            {step === 'send' ? 'Confirm quotes' : 'Send balance'}
          </DialogTitle>
          {step === 'getQuotes' && (
            <>
              <div className="pt-6 text-sm">Token</div>
              <div className="grid grid-cols-4 gap-4">
                {possibleSendingTokens.map((token) => (
                  <div
                    key={token}
                    className={`flex cursor-pointer items-center rounded-xl border border-slate-300 px-2 py-1.5 outline-none transition-colors ${
                      selectedToken === token
                        ? 'border-blue-500 bg-blue-100'
                        : 'bg-white'
                    } ${
                      structuredTokenData[token].total === '0'
                        ? 'pointer-events-none opacity-50'
                        : ''
                    }`}
                    onClick={() => setSelectedToken(token)}
                  >
                    <img
                      className="mr-2 size-6"
                      src={structuredTokenData[token].logoURI}
                      alt={structuredTokenData[token].symbol}
                    />
                    <div className="flex flex-col text-xs">
                      <div className="font-medium">
                        {structuredTokenData[token].symbol}
                      </div>
                      <div className="font-light">
                        {formatBalance(
                          structuredTokenData[token].total,
                          structuredTokenData[token].decimals
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid w-full items-center gap-1.5 pt-6">
                <Label className="text-sm" htmlFor="amount">
                  Amount
                </Label>
                <div className="flex h-20 items-center rounded-3xl border p-2">
                  <div>
                    <Input
                      className="border-none shadow-none focus-visible:ring-0 md:text-3xl"
                      id="amount"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <div className="pl-3 text-sm font-light text-gray-400">
                      ${amountUSD}
                    </div>
                  </div>
                  <div
                    onClick={onSetMax}
                    className="mr-4 cursor-pointer font-light"
                  >
                    MAX
                  </div>
                </div>
              </div>
              {solutionError && (
                <div className="pt-6">
                  <div className="text-sm text-red-500">
                    Error: {solutionError}
                  </div>
                </div>
              )}
              <div className="pt-6">
                <Button
                  onClick={onGetQuote}
                  className="w-full"
                  variant="secondary"
                  disabled={solutionLoading}
                  loading={solutionLoading}
                >
                  Get Quotes
                </Button>
              </div>
            </>
          )}
          {step === 'send' && !!receivedSolutions && (
            <>
              <SendContent
                solutions={receivedSolutions}
                token={selectedToken}
              />
              <div className="mt-4 text-center">
                <span
                  onClick={onGoBack}
                  className="cursor-pointer text-sm text-gray-400"
                >
                  Go Back
                </span>
              </div>
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
