import { ChainBalance } from '@/Portfolio'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import { useState } from 'react'

type Params = {
  chainBalances?: ChainBalance[]
}
export const Chains = ({ chainBalances }: Params) => {
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
          <HoverCardContent
            className="w-80 rounded-xl bg-slate-800 text-white"
            side="top"
          >
            {' '}
            Yoyoyo{' '}
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
