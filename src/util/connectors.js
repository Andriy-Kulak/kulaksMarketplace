import { Connect, SimpleSigner } from 'uport-connect'
// import {uportClientId, uportSigner } from '../configVars/index'

export const uport = new Connect('Andriy\'s MarketPlace v1', {
  clientId: '2of3uT6u4TeofSHEEnqpQ8TK4oEh8y1RNcU',
  network: 'rinkeby',
  signer: SimpleSigner('e16480dd208609ee0fba499200b87952f2d4fed1b759c83b2c645f05571af160')
})
