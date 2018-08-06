/* eslint-disable no-undef */
const KulaksMarketplace = artifacts.require('./KulaksMarketplace.sol')

contract('KulaksMarketplace JS version', (accounts) => {
  it('...should store the value 89.', async () => {
    const contractInstance = await KulaksMarketplace.deployed()
    const responseSet = await contractInstance.set(89, { from: accounts[0] })
    const responseGet = await contractInstance.get.call()

    assert.equal(typeof responseSet.tx, 'string', 'The set method did not respond with a tx')
    assert.equal(responseGet, 89, 'The value 89 was not stored.')
  })

  it('...should create a Shop', async () => {
    const shopName = 'test Name 3'
    const shopType = 'test Type'
    const description = 'test Description'
    const contractInstance = await KulaksMarketplace.deployed()
    const responseSet = await contractInstance.createShop(shopName, shopType, description, { from: accounts[0] })
    const shopGet = await contractInstance.shops(1)

    assert.equal(typeof responseSet.tx, 'string', 'The create Shop method did not respond with a tx')
    assert.equal(shopGet[0].c[0], 1, 'The Shop Id is not correct') // Shop Id
    assert.equal(shopGet[1], shopName, 'The Shop Name is not correct') // Shop Name
    assert.equal(shopGet[2], shopType, 'The Shop type is not correct') // Shop Type
    assert.equal(shopGet[3], description, 'The Shop description is not correct') // Shop description
    assert.equal(shopGet[4], accounts[0], 'The Shop owner is not correct') // Shop owner
  })

  it('...should create a Product', async () => {
    const shopId = 3
    const productName = 'test Product Name 2'
    const description = 'test Description'
    const price = 350000
    const contractInstance = await KulaksMarketplace.deployed()
    const responseSet = await contractInstance.createProduct(shopId, productName, description, price, { from: accounts[0] })
    const productsGet = await contractInstance.products(1)

    assert.equal(typeof responseSet.tx, 'string', 'The create Shop method did not respond with a tx')
    assert.equal(productsGet[0].c[0], 1, 'The Shop Id is not correct') // Product Id
    assert.equal(productsGet[1], productName, 'The Product Name is not correct') // Product Name
    assert.equal(productsGet[2], description, 'The Product description is not correct') // Product description
    assert.equal(productsGet[3].c[0], price, 'The Shop price is not correct') // Product Price
    assert.equal(productsGet[4], shopId, 'The Shop id is not correct') // Shop id
  })

  it('...should purchase created Product (id = 1)', async () => {
    const productId = 1
    const quantity = 2
    const price = 350000
    const totalCost = (price * quantity) + 20
    const contractInstance = await KulaksMarketplace.deployed()
    const responseSet = await contractInstance.purchaseProduct(productId, quantity, { from: accounts[0], value: totalCost })

    assert.equal(typeof responseSet.tx, 'string', 'The purchase did not go through')
  })

  it('...should have a shop balance = to two products + S&H (= 700020)', async () => {
    const shopId = 3
    const contractInstance = await KulaksMarketplace.deployed()
    const responseSet = await contractInstance.shopBalances(shopId, { from: accounts[0] })

    assert.equal(responseSet, 700020, 'The shop balance is incorrect')
  })
})

// const result = await contractInstance.shopBalances(shopId, { from: account })