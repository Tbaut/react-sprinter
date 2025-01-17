import { ChainBalance } from '@/Portfolio'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import { formatBalance } from '@/utils'
import { useState } from 'react'

type Params = {
  chainBalances: ChainBalance[]
  tokenSymbol: string
  tokenDecimals: number
}
export const Chains = ({
  chainBalances,
  tokenDecimals,
  tokenSymbol
}: Params) => {
  const [isPopoverOpen, setPopoverOpen] = useState(false)

  return (
    <div className="flex items-center">
      <HoverCard open={isPopoverOpen}>
        <HoverCardTrigger
          onMouseOver={() => {
            setPopoverOpen(true)
          }}
          onMouseOut={() => {
            setPopoverOpen(false)
          }}
        >
          <HoverCardContent className="w-56 text-white" side="top">
            <div className="text-xs font-light">
              Network distribution ({chainBalances.length})
            </div>

            <div className="my-2 border-b border-gray-800" />
            {chainBalances.map((chainBalance) => {
              return (
                <div
                  key={chainBalance.chain.chainID}
                  className="mb-2 flex items-center"
                >
                  <img
                    className="w-5"
                    src={chainBalance.chain.logoURI}
                    alt={chainBalance.chain.name}
                  />
                  <span className="ml-2 flex-1 text-left text-xs font-light">
                    {chainBalance.chain.name}
                  </span>
                  <span className="text-right text-xs font-medium">
                    {formatBalance(chainBalance.balance, tokenDecimals)}{' '}
                    {tokenSymbol}
                  </span>
                </div>
              )
            })}
          </HoverCardContent>
          <div className="flex items-center">
            {(chainBalances ?? []).map((chainBalance) => {
              return (
                <img
                  key={chainBalance.chain.chainID}
                  className="-ml-2 w-6 cursor-pointer"
                  src={chainBalance.chain.logoURI}
                  alt={chainBalance.chain.name}
                />
              )
            })}
          </div>
        </HoverCardTrigger>
      </HoverCard>
    </div>
  )
}
