/* eslint-disable no-undef */
const SimpleStorage = artifacts.require('./KulaksMarketplace.sol')

contract('KulaksMarketplace JS version', (accounts) => {
  it('...should store the value 89.', () => {
    return SimpleStorage.deployed().then((instance) => {
      simpleStorageInstance = instance

      return simpleStorageInstance.set(89, { from: accounts[0] })
    }).then(() => {
      return simpleStorageInstance.get.call()
    }).then((storedData) => {
      assert.equal(storedData, 89, 'The value 89 was not stored.')
    })
  })
})
