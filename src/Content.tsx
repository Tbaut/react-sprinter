import { useAppKitAccount } from '@reown/appkit/react'

export const Content = () => {
  const { address, status } = useAppKitAccount()

  return (
    <div className="m-4">
      <div>account: {address}</div>
      <div>status: {status}</div>
    </div>
  )
}
