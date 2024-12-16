import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { Button } from './components/ui/button'

export const Content = () => {
  const { open } = useAppKit()
  const { address, status } = useAppKitAccount()

  return (
    <div className="m-4">
      <Button
        onClick={() => {
          open().catch(console.error)
        }}
      >
        Open
      </Button>
      <div>account: {address}</div>
      <div>status: {status}</div>
    </div>
  )
}
