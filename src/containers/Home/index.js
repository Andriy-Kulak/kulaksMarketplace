import React, { Component } from 'react'
import contract from 'truffle-contract'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import MarketplaceContract from '../../contracts/KulaksMarketplace.json'
import getWeb3 from '../../util/getWeb3'
import HomeBody from '../../components/HomeBody'
import Layout from '../../components/Layout'
import { getUserBalance } from '../../redux/user/actions'
import { createStore } from '../../redux/shops/actions'
import { loadingModal } from '../../redux/modal/actions'

import DefaultModal from '../../components/Modal'

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
    const { web3 } = this.state
    const MarketContract = contract(MarketplaceContract)
    MarketContract.setProvider(web3.currentProvider)


    // Get accounts.
    const accounts = await this.state.web3.eth.getAccounts()
    MarketContract.deployed().then((contractInstance) => {

      // contractInstance.send(web3.toWei(10, "ether")).then(function(result, e) {
      //   // Same result object as above.
      //   console.log('RESULT ===========', result)
      //   console.log('ERROR ===========', e)
      // });

      // used to test the application to set the value to 5
      //   // Stores a given value, 5 by default.
      //   return simpleStorageInstance.set(5, { from: accounts[0] })
      // }).then(() => {
      //   // Get the value from the contract to prove it worked.
      //   return simpleStorageInstance.get.call(accounts[0])
      // }).then((result) => {
      //   // Update state with the result.
      //   return this.setState({ storageValue: result.c[0], contractInstance: simpleStorageInstance, account: accounts[0] })

      return this.setState({ contractInstance, account: accounts[0] })
    })
    // })
  }

  makeMyselfAdmin = async () => {
    const { web3 } = this.state
    const { user, actions } = this.props
    if (!user) {
      alert('You are not signed in')
    } else {
      actions.getUserBalance(web3, user.ethAddress)

      const { contractInstance, account } = this.state

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

  createStore = () => {
    const { user, actions } = this.props
    if (!user) {
      alert('You are not signed in')
    } else {
      actions.createStore({
        name: 'Test Name',
        type: 'TEst Type',
        description: 'Test Description',
        address: user.ethAddress
      })
    }
  }

  makeMyselfShopOwner = async () => {
    const { user } = this.props
    if (!user) {
      alert('You are not signed in')
    } else {
      const { contractInstance, account } = this.state
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
            return this.setState({ storageValue: getResult.c[0] })
          })
      })
  }

  testBalance = async () => {
    const { contractInstance, account } = this.state
    const result = await contractInstance.testBalance.call()
    console.log('BALANCE ======>>', result)
  }

  loadingTrigger = () => {
    const { actions } = this.props
    return actions.loadingModal()
  }

  render() {
    const { user, userAcctBalance, modal } = this.props
    return (
      <div className="App">
        <Layout>
          <div style={{ paddingTop: '100px' }}>
            <button onClick={() => (this.testBalance())}> CHECK BALANCE</button>
            <button onClick={() => (this.createStore())}> Create STORE</button>
            <button onClick={() => (this.loadingTrigger())}> LOADING TRIGGER</button>
          </div>
          
          <HomeBody
            updateValue={(value) => (this.handleClick(value))}
            storageValue={this.state.storageValue}
            makeMyselfAdmin={() => (this.makeMyselfAdmin())}
            makeMyselfShopOwner={() => (this.makeMyselfShopOwner())}
            userData={user}
            userAcctBalance={userAcctBalance}
          />
          <DefaultModal
            active={modal.active}
            header={modal.header}
            body={modal.body}
          />
        </Layout>
      </div>
    )
  }
}

Home.propTypes = {
  user: PropTypes.object.isRequired,
  userAcctBalance: PropTypes.number.isRequired,
  actions: PropTypes.object.isRequired,
  modal: PropTypes.object.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    loadingModal,
    getUserBalance,
    createStore
  }, dispatch),
})

const mapStateToProps = (state) => ({
  user: state.user.data,
  modal: state.modal,
  userAcctBalance: state.user.userAcctBalance
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
