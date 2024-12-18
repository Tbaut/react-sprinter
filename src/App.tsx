import { SprinterContext } from '@chainsafe/sprinter-react'
import { Environment } from '@chainsafe/sprinter-sdk'
import { Content } from './Content'
import { AppKitProvider } from './context/AppKitContext'
import Header from './components/Header'

function App() {
  return (
    <AppKitProvider>
      <SprinterContext baseUrl={Environment.TESTNET}>
        <Header />
        <Content />
      </SprinterContext>
    </AppKitProvider>
  )
}

export default App
