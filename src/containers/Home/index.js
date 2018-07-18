import React, { Component } from 'react'
import contract from 'truffle-contract'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import MarketplaceContract from '../../contracts/KulaksMarketplace.json'
import getWeb3 from '../../util/getWeb3'


// actions
import { getUserBalance } from '../../redux/user/actions'
import { createShop, getAllShopsByOwner } from '../../redux/shops/actions'
import { loadingModal } from '../../redux/modal/actions'

// components
import HomeBody from '../../components/HomeBody'
import Layout from '../../components/Layout'
import CreateStore from '../../components/CreateStore'
import DefaultModal from '../../components/Modal'
import StoreList from '../../components/StoreList'

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
    const { actions } = this.props
    const MarketContract = contract(MarketplaceContract)
    MarketContract.setProvider(web3.currentProvider)


    // Get accounts.
    const accounts = await this.state.web3.eth.getAccounts()
    MarketContract.deployed().then((contractInstance) => {
      return this.setState({ contractInstance, account: accounts[0] })
    })
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

  createStore = ({ name, type, description }) => {
    if (!name || !type || !description) {
      alert('You did not provide a name, type or description for the store')
    }

    const { actions } = this.props
    const { contractInstance, account } = this.state
    actions.createShop({
      contractInstance,
      name,
      type,
      description,
      account
    })
  }

  getAllStoresByOwner = () => {
    const { contractInstance, account } = this.state
    const { actions } = this.props
    actions.getAllShopsByOwner({ contractInstance, account })
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
    const { contractInstance } = this.state
    const result = await contractInstance.testBalance.call()
    console.log('BALANCE ======>>', result)
  }

  loadingTrigger = () => {
    const { actions } = this.props
    return actions.loadingModal()
  }

  testSender = async () => {
    const { contractInstance } = this.state
    const result = await contractInstance.user()
    const resultWithCall = await contractInstance.user.call()
    console.log('owner RESULT ======>>', result)
    console.log('owner result with Call ===>', resultWithCall)
  }

  getFirstStore = async () => {
    const { contractInstance } = this.state
    const result = await contractInstance.getStoreInfo.call(1)
    console.log('getFirstStore RESULT ======>>', result)
  }

  render() {
    const { user, userAcctBalance, modal, shops } = this.props
    console.log('shops', shops.owner)
    return (
      <div className="App">
        <Layout>
          <div style={{ paddingTop: '10px' }}>
            <button onClick={() => (this.testBalance())}> CHECK BALANCE</button>
            <button onClick={() => (this.createStore())}> Create STORE</button>
            <button onClick={() => (this.loadingTrigger())}> LOADING TRIGGER</button>
            <button onClick={() => (this.testSender())}> Test SENDER</button>
            <button onClick={() => (this.getFirstStore())}> Get First Store</button>
            <button onClick={() => (this.getAllStoresByOwner())}> Get All Stores By Owner</button>
          </div>

          <CreateStore onSubmit={(values) => (this.createStore({ ...values }))} />

          <StoreList storeList={shops.owner} />

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

Home.defaultProps = {
  user: null,
  userAcctBalance: null
}

Home.propTypes = {
  user: PropTypes.object,
  userAcctBalance: PropTypes.number,
  actions: PropTypes.object.isRequired,
  modal: PropTypes.object.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    loadingModal,
    getUserBalance,
    createShop,
    getAllShopsByOwner,
  }, dispatch),
})

const mapStateToProps = (state) => ({
  user: state.user.data,
  modal: state.modal,
  userAcctBalance: state.user.userAcctBalance,
  shops: state.shops
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
