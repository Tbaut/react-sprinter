import { SprinterContext } from '@chainsafe/sprinter-react'
import { Environment } from '@chainsafe/sprinter-sdk'
import { Content } from './Content'
import { AppKitProvider } from './context/AppKitContext'
import Header from './components/Header'
import { ChainTokensContextProvider } from './context/ChainTokensContext'

function App() {
  return (
    <AppKitProvider>
      <SprinterContext baseUrl={Environment.TESTNET}>
        <ChainTokensContextProvider>
          <div className="h-screen bg-radial-gradient bg-right-bottom bg-no-repeat">
            <Header />
            <Content />
          </div>
        </ChainTokensContextProvider>
      </SprinterContext>
    </AppKitProvider>
  )
}

export default App
