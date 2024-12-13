import { SprinterContext } from '@chainsafe/sprinter-react'
import { Environment } from '@chainsafe/sprinter-sdk'
import { Content } from './Content'

function App() {
  return (
    <div>
      <SprinterContext baseUrl={Environment.TESTNET}>
        <Content />
      </SprinterContext>
    </div>
  )
}

export default App
