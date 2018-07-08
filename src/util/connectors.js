import { Connect, SimpleSigner } from 'uport-connect'
import {uportClientId, uportSigner } from '../configVars/index'

export const uport = new Connect('Andriy\'s MarketPlace v1', {
  clientId: uportClientId,
  network: 'rinkeby',
  signer: SimpleSigner(uportSigner)
})
