import React, { Component } from 'react'
import contract from 'truffle-contract'
import MarketplaceContract from '../../contracts/KulaksMarketplace.json'
import getWeb3 from '../../util/getWeb3'
import HomeBody from '../../components/HomeBody'
import Layout from '../../components/Layout'

// Styles
import 'antd/dist/antd.css' // eslint-disable-line
import '../../css/oswald.css'
import '../../css/open-sans.css'
import '../../css/pure-min.css'
import './styles.css'


class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      contractInstance: null,
      account: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    getWeb3
      .then((results) => {
        this.setState({
          web3: results.web3
        })

        // Instantiate contract once web3 provided.
        this.instantiateContract()
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  instantiateContract = async () => {
    const MarketContract = contract(MarketplaceContract)
    MarketContract.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    let simpleStorageInstance

    // Get accounts.
    const accounts = await this.state.web3.eth.getAccounts()
    MarketContract.deployed().then((instance) => {
      simpleStorageInstance = instance

      // Stores a given value, 5 by default.
      return simpleStorageInstance.set(5, { from: accounts[0] })
    }).then(() => {
      // Get the value from the contract to prove it worked.
      return simpleStorageInstance.get.call(accounts[0])
    }).then((result) => {
      // Update state with the result.
      return this.setState({ storageValue: result.c[0], contractInstance: simpleStorageInstance, account: accounts[0] })
    })
    // })
  }

  makeMyselfAdmin = async () => {
    const { contractInstance, account } = this.state
    contractInstance.becomeAdmin(null, { from: account })
      .then((result) => {
        console.log('CHECK RESULT For becomeAdmin', result)
        // Get the value from the contract to prove it worked.
        return contractInstance.checkIfSenderAdmin.call(account)
      }).then((result) => {
        console.log('CHECK RESULT For checkIfSenderAdmin', result)
      })
  }

  handleClick(value) {
    const { contractInstance, account } = this.state
    contractInstance.set(value, { from: account })
      .then(() => {
        return contractInstance.get.call()
          .then((getResult) => {
            return this.setState({ storageValue: getResult.c[0]})
          })
      })
  }

  render() {
    return (
      <div className="App">
        <Layout>
          <HomeBody
            updateValue={(value) => (this.handleClick(value))}
            storageValue={this.state.storageValue}
            makeMyselfAdmin={() => (this.makeMyselfAdmin())}
          />
        </Layout>
      </div>
    )
  }
}

export default Home
