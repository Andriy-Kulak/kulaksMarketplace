import React, { Component } from 'react'
import contract from 'truffle-contract'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import MarketplaceContract from '../../contracts/KulaksMarketplace.json'
import getWeb3 from '../../util/getWeb3'


// actions
import { getUserBalance } from '../../redux/user/actions'
import { createShop, getAllShopsByOwner, createProduct, getAllProductsByShop } from '../../redux/shops/actions'
import { loadingModal } from '../../redux/modal/actions'

// components
import HomeBody from '../../components/HomeBody'
import Layout from '../../components/Layout'
import DefaultModal from '../../components/Modal'
import ShopList from '../../components/ShopList'
import ProductList from '../../components/ProductList'

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
      account: null,
      selectedShopId: 1
    }
  }

  componentWillMount = async () => {
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
      this.setState({ contractInstance, account: accounts[0] })
      this.getAllShopsByOwner()
      return actions.getAllProductsByShop({
        shopId: 1,
        account: accounts[0],
        contractInstance })
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

  createShop = ({ name, type, description }) => {
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

  getAllShopsByOwner = () => {
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

  createProduct = async (values) => {
    const { name, description, price, shopId } = values
    const parsedPrice = parseInt(price, 10)
    const { actions } = this.props
    const { contractInstance, account } = this.state
    actions.createProduct({ contractInstance, name, description, price: parsedPrice, account, shopId })
    // const result = await contractInstance.createProduct(shopId, name, description, parsedPrice, { from: account })
    // console.log('RESULT of CREATE PRODUCT ==>', result)
  }

  selectShop = (id) => {
    // if id = newShop, don't do anything. User has selected the tab for creating a new Shop
    if (id !== 'newShop') {
      const { actions } = this.props
      const { contractInstance, account } = this.state
      this.setState({ ...this.state, selectedShopId: parseInt(id, 10) })
      actions.getAllProductsByShop({ shopId: id, account, contractInstance })
    }
  }

  render() {
    const { user, userAcctBalance, modal, shops, actions } = this.props
    const { contractInstance, account } = this.state
    console.log('shops', shops.owner)
    return (
      <div className="App">
        <Layout>
          <div style={{ paddingTop: '10px' }}>
            <button onClick={() => (this.testBalance())}> CHECK BALANCE</button>
            <button onClick={() => (this.createShop())}> Create STORE</button>
            <button onClick={() => (this.loadingTrigger())}> LOADING TRIGGER</button>
            <button onClick={() => (this.testSender())}> Test SENDER</button>
            <button onClick={() => (this.getFirstStore())}> Get First Store</button>
            <button onClick={() => (this.getAllShopsByOwner())}> Get All Stores By Owner</button>
          </div>

          {/* <CreateStore onSubmit={(values) => (this.createShop(values))} /> */}

          <ShopList
            productList={shops.products}
            shopList={shops.owner}
            createProduct={(values) => (actions.createProduct({ ...values, contractInstance, account }))}
            selectShop={(id) => (this.selectShop(id))}
            createShop={(values) => this.createShop(values)}
          />
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
  modal: PropTypes.object.isRequired,
  shops: PropTypes.object.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    loadingModal,
    getUserBalance,
    createShop,
    getAllShopsByOwner,
    createProduct,
    getAllProductsByShop
  }, dispatch),
})

const mapStateToProps = (state) => ({
  user: state.user.data,
  modal: state.modal,
  userAcctBalance: state.user.userAcctBalance,
  shops: state.shops
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
