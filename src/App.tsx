import { SprinterContext } from '@chainsafe/sprinter-react'
import { Environment } from '@chainsafe/sprinter-sdk'
import { Content } from './Content'
import { AppKitProvider } from './AppKitProvider'

function App() {
  return (
    <AppKitProvider>
      <SprinterContext baseUrl={Environment.TESTNET}>
        <Content />
      </SprinterContext>
    </AppKitProvider>
  )
}

export default App
