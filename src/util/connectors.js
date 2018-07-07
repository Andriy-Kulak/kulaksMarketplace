import { Connect, SimpleSigner } from 'uport-connect'
import {uportClientId, uportSigner } from '../configVars/index'

// export let uport = new Connect('TruffleBox')

export const uport = new Connect('Andriy\'s MarketPlace v1', {
  clientId: uportClientId,
  network: 'rinkeby',
  signer: SimpleSigner(uportSigner)
})
// export const web3 = uport.getWeb3()
