import contract from 'truffle-contract'

// Get network provider and web3 instance.
// See utils/getWeb3 for more info.
const instantiateContract = async ({ getWeb3, contractJson }) => {
  const startTime = Date.now()
  const results = await getWeb3
  const accounts = await results.web3.eth.getAccounts()
  const MarketContract = contract(contractJson)
  MarketContract.setProvider(results.web3.currentProvider)
  const contractInstance = await MarketContract.deployed()
  console.log('FINISH TIME', Date.now() - startTime)
  return ({ web3: results.web3, account: accounts[0], contractInstance })
}

export default instantiateContract

