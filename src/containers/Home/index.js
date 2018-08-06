import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import MarketplaceContract from '../../contracts/KulaksMarketplace.json'
import getWeb3 from '../../util/getWeb3'
import instantiateContract from '../../util/instantiateContract'


// actions
import { getUserBalance } from '../../redux/user/actions'
import {
  createShop,
  getAllShopsByOwner,
  createProduct,
  getAllProductsByShop,
  checkShopBalance,
  withdrawBalance
} from '../../redux/shops/actions'
import { loadingModal } from '../../redux/modal/actions'

// components
// import HomeBody from '../../components/HomeBody'
import AdminTestPanel from '../../components/AdminTestPanel'
import Layout from '../../components/Layout'
import DefaultModal from '../../components/Modal'
import ShopList from '../../components/ShopList'

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
    try {
      const { web3, contractInstance, account } = await instantiateContract({
        getWeb3,
        contractJson: MarketplaceContract
      })
      this.setState({
        ...this.state,
        web3,
        contractInstance,
        account

      })
      this.initializeData()
    } catch (e) {
      console.log('Error finding web3 or instatiating the contract.', e.message)
    }
  }

  initializeData = async () => {
    const { account, contractInstance } = this.state
    const { actions } = this.props
    this.getAllShopsByOwner() // get all shops for owner
    // by default you will only get products for the first shop if it exists in the contract
    return actions.getAllProductsByShop({
      shopId: 1,
      account,
      contractInstance })
  }

  makeMyselfAdmin = async () => {
    const { web3 } = this.state
    const { user, actions } = this.props
    const { contractInstance, account } = this.state
    // if (!user) {
    //   alert('You are not signed in')
    // } else {
    actions.getUserBalance(web3, account)

    // make the logged in user an admin
    contractInstance.becomeAdmin(account, { from: account })
      .then((result) => {
        console.log('CHECK RESULT For becomeAdmin', result)
        // Get the value from the contract to prove it worked.
        return contractInstance.users(account)
      }).then((result) => {
        console.log('CHECK RESULT For checkIfUserAdmin', result)
      })
    // }
  }


  makeMyselfShopOwner = async () => {
    const { user } = this.props
    // if (!user) {
    //   alert('You are not signed in')
    // } else {
    const { contractInstance, account } = this.state
    // make the logged in user an admin
    contractInstance.becomeShopOwner(account, { from: account })
      .then((result) => {
        console.log('CHECK RESULT For becomeAdmin', result)
        // Get the value from the contract to prove it worked.
        return contractInstance.users(account)
      }).then((result) => {
        console.log('CHECK RESULT For checkIfUserShopOwner', result)
      })
    // }
  }

  checkShopBalance = async (shopId) => {
    const { contractInstance, account } = this.state
    const result = await contractInstance.shopBalances(shopId, { from: account })
    console.log('CHECK SHOP BALANCE RESULT', result)
    console.log('DETAILED RESULT', result.c[0])
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

  // createProduct = async (values) => {
  //   const { name, description, price, shopId } = values
  //   const parsedPrice = parseInt(price, 10)
  //   const { actions } = this.props
  //   const { contractInstance, account } = this.state
  //   actions.createProduct({ contractInstance, name, description, price: parsedPrice, account, shopId })
  // }

  selectShop = (id) => {
    // if id = newShop, don't do anything. User has selected the tab for creating a new Shop
    if (id !== 'newShop') {
      const { actions } = this.props
      const { contractInstance, account } = this.state
      this.setState({ ...this.state, selectedShopId: parseInt(id, 10) })
      actions.getAllProductsByShop({ shopId: id, account, contractInstance })
      actions.checkShopBalance({ shopId: id, account, contractInstance })
    }
  }

  render() {
    const { modal, shops, actions, loading } = this.props
    const { contractInstance, account } = this.state
    console.log('shops', shops.owner)
    console.log('this.state', this.state.web3)
    return (
      <Layout>
        <div style={{ paddingTop: '10px', border: '1px solid black' }}>
          <h2>Testing Section</h2>
          <p>
            For the purposes of this sample e-commerce app, we are giving you ability to change between Admin, Shop Owner and Regular User access types.
            This will give you ability to test and play around with functionality of all 3 types of access.
          </p>
          <button onClick={async () => {
            const result = await contractInstance.users(account)
            console.log('result of CHECK USER', result)
            }}
          >
            Check User Status
          </button>
          <button onClick={() => (this.testBalance())}> CHECK BALANCE</button>
          <button onClick={() => (this.createShop())}> Create STORE</button>
          <button onClick={() => (this.loadingTrigger())}> LOADING TRIGGER</button>
          <button onClick={() => (this.testSender())}> Test SENDER</button>
          <button onClick={() => (this.getFirstStore())}> Get First Store</button>
          <button onClick={() => (this.getAllShopsByOwner())}> Get All Stores By Owner</button>
          <div>
            <p>The stored value is: {this.state.storageValue}</p>
          </div>
          <h2> ----------------------------- </h2>
          <button onClick={() => (this.makeMyselfAdmin())}>Make Myself Admin</button>
          <button onClick={() => (this.makeMyselfShopOwner())}>Make Myself Shop Owner</button>
          <button onClick={() => (this.handleClick(20))}>Update Value to 20</button>
        </div>

        {/* <CreateStore onSubmit={(values) => (this.createShop(values))} /> */}
        <AdminTestPanel
          makeMyselfAdmin={() => (this.makeMyselfAdmin())}
          makeMyselfShopOwner={() => (this.makeMyselfShopOwner())}
          makeMyselfUser={() => ({})}
        />
        <ShopList
          productList={shops.products}
          shopList={shops.owner}
          shopBalances={shops.shopBalances}
          createProduct={(values) => (actions.createProduct({ ...values, contractInstance, account }))}
          selectShop={(id) => (this.selectShop(id))}
          withdrawBalance={(id) => (actions.withdrawBalance({ shopId: id, account, contractInstance }))}
          createShop={(values) => this.createShop(values)}
          loading={loading}
        />
        {/* <HomeBody
          updateValue={(value) => (this.handleClick(value))}
          storageValue={this.state.storageValue}
          makeMyselfAdmin={() => (this.makeMyselfAdmin())}
          makeMyselfShopOwner={() => (this.makeMyselfShopOwner())}
          userData={user}
          userAcctBalance={userAcctBalance}
        /> */}
        <DefaultModal
          active={modal.active}
          header={modal.header}
          body={modal.body}
        />
      </Layout>
    )
  }
}

Home.defaultProps = {
  user: null,
  // userAcctBalance: null
}

Home.propTypes = {
  user: PropTypes.object,
  // userAcctBalance: PropTypes.number,
  actions: PropTypes.object.isRequired,
  modal: PropTypes.object.isRequired,
  shops: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired // loading object containining all loading statuses
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    loadingModal,
    getUserBalance,
    createShop,
    getAllShopsByOwner,
    createProduct,
    getAllProductsByShop,
    checkShopBalance,
    withdrawBalance
  }, dispatch),
})

const mapStateToProps = (state) => ({
  user: state.user.data,
  modal: state.modal,
  userAcctBalance: state.user.userAcctBalance,
  shops: state.shops,
  loading: state.loading
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
