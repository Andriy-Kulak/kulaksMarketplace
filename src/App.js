import React, { Component } from 'react'
import contract from 'truffle-contract'
import MarketplaceContract from '../build/contracts/KulaksMarketplace.json'
import getWeb3 from './util/getWeb3'
import Home from './layouts/home/Home'
import Layout from './components/Layout'

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      contract: null,
      account: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
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

  instantiateContract = async() => {
    const simpleStorage = contract(MarketplaceContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    const accounts  = await this.state.web3.eth.getAccounts()
      console.log('this.state.web3', this.state.web3)
      console.log('accounts =>', accounts)
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        // Stores a given value, 5 by default.
        return simpleStorageInstance.set(5, {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        // AK_ADDED
        return this.setState({ storageValue: result.c[0], contract: simpleStorageInstance, account: accounts[0] })
      })
    // })
  }

  makeMyselfAdmin = async() => {
    const simpleStorage = contract(MarketplaceContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    const time = Date.now()
    const accounts  = await this.state.web3.eth.getAccounts()
    console.log('time it took to get accounts', Date.now() - time)
      console.log('this.state.web3', this.state.web3)
      console.log('accounts =>', accounts)
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance
        console.log('What is in simpleStorageInstance', simpleStorageInstance)

        // Stores a given value, 5 by default.
        return simpleStorageInstance.becomeAdmin(null, {from: accounts[0]})
      }).then((result) => {
        console.log('CHECK RESULT For becomeAdmin', result)
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.checkIfSenderAdmin.call(accounts[0])
      }).then((result) => {
        console.log('CHECK RESULT For checkIfSenderAdmin', result)
        // Update state with the result.
        // AK_ADDED
        // return this.setState({ storageValue: result.c[0], contract: simpleStorageInstance, account: accounts[0] })
      })
    // })
  }

  handleClick(event) {
    const contract = this.state.contract
    const account = this.state.account

    const value = 3

    contract.set(value, {from: account})
      .then(result => {
        return contract.get.call()
      }).then(result => {
        return this.setState({ storageValue: result.c[0]})
      })
  }

  render() {
    return (
      <div className="App">
        <Layout> 
          <Home storageValue={this.state.storageValue} makeMyselfAdmin={() => (this.makeMyselfAdmin())} />
          {this.props.children}
        </Layout>
      </div>
    );
  }
}

export default App
