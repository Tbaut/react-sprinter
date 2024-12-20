import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { Button } from './ui/button'
import logo from '@/assets/sprint-logo.svg'
import { useCallback } from 'react'
import { AddressButton } from './AddressButton'

// const mainNavItems = ['A', 'B', 'C']

export default function MainNav() {
  const { open } = useAppKit()
  const { address, status } = useAppKitAccount()

  const openAppKitModal = useCallback(() => {
    open().catch(console.error)
  }, [open])

  return (
    <div className="hidden w-full gap-2 px-11 md:flex">
      <img src={logo} alt="logo" />
      {/* {mainNavItems.map((item, index) => (
        <Button key={index} variant="link">
          {item}
        </Button>
      ))} */}
      <div className="flex-1" />
      {['disconnected', 'connecting'].includes(status ?? '') && (
        <Button
          variant="default"
          disabled={status === 'connecting'}
          onClick={openAppKitModal}
        >
          Connect
        </Button>
      )}
      {status === 'connected' && address && (
        <AddressButton address={address} onClick={openAppKitModal} />
      )}
    </div>
  )
}
