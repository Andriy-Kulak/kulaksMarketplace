import React, { Component } from 'react'
import contract from 'truffle-contract'
// import Web3 from 'web3'
import each from 'lodash/each'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
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
    const { web3 } = this.state
    const { user } = this.props
    if (!user) {
      alert('You are not signed in')
    } else {
      console.log('userEthAddress ===>', user.ethAddress)
      console.log('web3.eth.', web3.eth)
      console.log('web3.', web3)
      // console.log('get balance of EthAddress', web3.fromWei(web3.eth.getBalance(user.ethAddress)))
      // web3.eth.defaultAccount = user.ethAddress

      // web3.eth.coinbase = user.ethAddress

      // web3.eth.getAccounts((err, acc) => {
      //   console.log('acc -->', acc)
      //   each(acc, (e) => {
      web3.eth.getBalance(user.ethAddress, (error, result) => {
        console.log('ERRRORRRRRR', error)
        if (!error) {
          console.log('Result from web3', result)
        }
      })
      //   })
      // })
      const { contractInstance, account } = this.state
      console.log('web 3 account', account)
      console.log('contractInstance ===>', contractInstance)
      // make the logged in user an admin
      contractInstance.becomeAdmin(user.ethAddress, { from: account })
        .then((result) => {
          console.log('CHECK RESULT For becomeAdmin', result)
          // Get the value from the contract to prove it worked.
          return contractInstance.checkIfUserAdmin.call(user.ethAddress)
        }).then((result) => {
          console.log('CHECK RESULT For checkIfUserAdmin', result)
        })
    }
  }

  makeMyselfShopOwner = async () => {
    const { user } = this.props
    if (!user) {
      alert('You are not signed in')
    } else {
      console.log('userEthAddress ===>', user.ethAddress)
      const { contractInstance, account } = this.state
      console.log('contractInstance ===>', contractInstance)
      // make the logged in user an admin
      contractInstance.becomeShopOwner(user.ethAddress, { from: account })
        .then((result) => {
          console.log('CHECK RESULT For becomeAdmin', result)
          // Get the value from the contract to prove it worked.
          return contractInstance.checkIfUserShopOwner.call(user.ethAddress)
        }).then((result) => {
          console.log('CHECK RESULT For checkIfUserShopOwner', result)
        })
    }
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
    const { user } = this.props
    return (
      <div className="App">
        <Layout>
          <HomeBody
            updateValue={(value) => (this.handleClick(value))}
            storageValue={this.state.storageValue}
            makeMyselfAdmin={() => (this.makeMyselfAdmin())}
            makeMyselfShopOwner={() => (this.makeMyselfShopOwner())}
            userData={user}
          />
        </Layout>
      </div>
    )
  }
}

Home.propTypes = {
  user: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  user: state.user.data
})

export default connect(mapStateToProps)(Home)
