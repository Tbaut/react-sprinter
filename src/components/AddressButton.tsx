import { getTruncatedAddress } from '@/lib/utils'
import accountIcon from '../assets/account-icon.svg'

type AddressButtonProps = {
  address: string
  onClick?: () => void
}

export const AddressButton = ({ address, onClick }: AddressButtonProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <div
      onClick={handleClick}
      className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-xl border border-[#eeeeee] bg-white px-3.5 py-2 text-sm shadow-[0px_4px_5px_0px_rgba(10,13,20,0.03)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
    >
      <img src={accountIcon} alt="logo" />
      {getTruncatedAddress(address)}
    </div>
  )
}
