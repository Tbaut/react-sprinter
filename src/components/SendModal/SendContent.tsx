// const web3 = new Web3($selectedProvider.provider);

import { useChainTokens } from '@/context/ChainTokensContext'
import { Button } from '../ui/button'
import { Solution } from '@chainsafe/sprinter-sdk/dist/types'
import { useCallback, useMemo, useState } from 'react'
import { formatBalance } from '@/utils'
import {
  useAccount,
  useSendTransaction,
  useSwitchChain,
  usePublicClient
} from 'wagmi'

// // @ts-expect-error   // chainId is missing in web3js call options type
// const callOptions: NonPayableCallOptions = { chainId: quoteRecord.sourceChain };

// console.info('Quote', quoteRecord);

// // Approval sniff etc...\
// if (quoteRecord.approvals && quoteRecord.approvals.length > 0) {
//   for (const approval of quoteRecord.approvals) {
//     console.log('Requesting approval:', approval);
//     const receipt = await web3.eth.sendTransaction(approval);
//     console.warn(`Approval receipt: `, receipt);
//   }
// } else {
//   const erc20 = new web3.eth.Contract(erc20Abi, quoteRecord.sourceTokenAddress);

//   const allowed = await erc20.methods
//     .allowance(ownerAddress, quoteRecord.transaction.to)
//     .call(callOptions);

//   if (BigInt(quoteRecord.amount) > BigInt(allowed)) {
//     const approval = await erc20.methods
//       .approve(quoteRecord.transaction.to, quoteRecord.amount)
//       .send({
//         ...callOptions,
//         from: ownerAddress
//       });
//     if (!approval.status) throw new Error('Not Approved!'); // To stop execution
//   }
// }

// // FINAL STEP!
// const receipt = await web3.eth.sendTransaction(quoteRecord.transaction);

// console.warn(`TX receipt: `, receipt);
type Props = {
  solutions: Solution[]
  token: string
}

// destinationChain: ChainID;
// destinationTokenAddress: Address;
// duration: number;
// fee: Amount;
// gasCost: Amount;
// senderAddress: Address;
// sourceChain: ChainID;
// sourceTokenAddress: Address;
// amount: string;
// tool: Tool;
// transaction: Transaction;
// approvals?: Transaction[];

export const SendContent = ({ solutions, token }: Props) => {
  const { chainId: currentChainId } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()
  const [isLoading, setIsLoading] = useState(false)
  const { structuredTokenData, chains } = useChainTokens()
  const { switchChainAsync } = useSwitchChain()
  const publicClient = usePublicClient()
  const sourceChains = useMemo(() => {
    const sourceChainIds = solutions.map((s) => s.sourceChain)
    return chains.filter((chain) => sourceChainIds.includes(chain.chainID))
  }, [chains, solutions])

  const destinationChains = useMemo(() => {
    const destChainIds = solutions.map((s) => s.destinationChain)
    return chains.filter((chain) => destChainIds.includes(chain.chainID))
  }, [chains, solutions])

  const totalFeesUsd = useMemo(() => {
    let total = 0
    for (const solution of solutions) {
      total += solution.fee.amountUSD
    }
    return total
  }, [solutions])

  const totalAmount = useMemo(() => {
    let total = 0n
    for (const solution of solutions) {
      total += BigInt(solution.amount)
    }
    return total
  }, [solutions])

  const onConfirm = useCallback(async () => {
    setIsLoading(true)
    for (const solution of solutions) {
      if (currentChainId !== solution.sourceChain) {
        await switchChainAsync({ chainId: solution.sourceChain })
      }

      if (solution.approvals && solution.approvals.length > 0) {
        for (const approval of solution.approvals) {
          console.log('Requesting approval:', approval)

          const { to, gasLimit, data, from, chainId, value } = approval
          const receipt = await sendTransactionAsync({
            to,
            gas: BigInt(gasLimit),
            data: data as `0x${string}`,
            account: from,
            chainId,
            value: BigInt(value)
          })
          console.log(`Approval receipt: `, receipt)
        }
      }

      console.log('Sending tx:', solution)

      const { to, gasLimit, data, from, value, chainId } = solution.transaction
      const receipt = await sendTransactionAsync({
        to,
        gas: BigInt(gasLimit),
        data: data as `0x${string}`,
        account: from,
        chainId,
        value: BigInt(value)
      })
      console.warn(`Approval receipt: `, receipt)
      await publicClient?.waitForTransactionReceipt({ hash: receipt })
    }
    setIsLoading(false)
  }, [
    currentChainId,
    publicClient,
    sendTransactionAsync,
    solutions,
    switchChainAsync
  ])

  return (
    <div>
      <div className="grid grid-cols-2">
        <div className="mt-4 text-sm font-light">Souce Chains</div>
        <div className="text-right text-sm">
          <div className="flex h-12 items-center justify-end">
            <div className="flex items-center pl-2">
              {sourceChains.map((sourceChain) => {
                return (
                  <img
                    key={sourceChain.chainID}
                    className="-ml-2 w-6 min-w-6 cursor-pointer"
                    src={sourceChain.logoURI}
                    alt={sourceChain.name}
                  />
                )
              })}
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm font-light">Destination Chain</div>
        <div className="text-right text-sm">
          <div className="flex h-12 items-center justify-end">
            <div className="flex items-center pl-2">
              {destinationChains.map((destChain) => {
                return (
                  <img
                    key={destChain.chainID}
                    className="-ml-2 w-6 min-w-6 cursor-pointer"
                    src={destChain.logoURI}
                    alt={destChain.name}
                  />
                )
              })}
            </div>
          </div>
        </div>
        <div className="mt-4 text-sm font-light">Fees</div>
        <div className="mt-4 text-right text-sm">{totalFeesUsd} USD</div>
        <div className="mt-4 text-sm font-light">Amount</div>
        <div className="mt-4 text-right text-sm">
          {formatBalance(
            totalAmount.toString(),
            structuredTokenData[token].decimals
          )}{' '}
          {structuredTokenData[token].symbol}
        </div>
      </div>
      <div className="pt-6">
        <Button
          onClick={() => {
            onConfirm().catch(console.error)
          }}
          className="w-full"
          variant="secondary"
          disabled={isLoading}
          loading={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  )
}
