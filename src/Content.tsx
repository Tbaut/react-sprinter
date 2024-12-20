import { useAppKitWallet } from '@reown/appkit-wallet-button/react'
import { Button } from './components/ui/button'

export const Content = () => {
  const { isReady, isPending, connect } = useAppKitWallet({
    onSuccess() {
      // ...
    },
    onError(error) {
      console.error(error)
      // ...
    }
  })

  return (
    <div className="m-4">
      <Button
        onClick={() => {
          connect('metamask').catch(console.error)
        }}
      >
        Connect MM
      </Button>
    </div>
  )
}
