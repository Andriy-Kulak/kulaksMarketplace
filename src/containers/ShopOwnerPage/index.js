import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import MarketplaceContract from '../../contracts/KulaksMarketplace.json'
import getWeb3 from '../../util/getWeb3'
import instantiateContract from '../../util/instantiateContract'
import { displayError } from '../../util/displayMessage'

// actions
import {
  getUserBalance,
  makeMyselfAdmin,
  makeMyselfShopOwner,
  makeMyselfRegularUser,
  getUserStatus
} from '../../redux/user/actions'
import {
  createShop,
  getAllShopsByOwner,
  createProduct,
  getAllProductsByShop,
  checkShopBalance,
  withdrawBalance,
} from '../../redux/shops/actions'
import { loadingModal } from '../../redux/modal/actions'

// components
import AdminTestPanel from '../../components/AdminTestPanel'
import Layout from '../../components/Layout'
import DefaultModal from '../../components/Modal'
import ShopList from '../../components/ShopList'

// Styles
import 'antd/dist/antd.css' // eslint-disable-line
import '../../css/pure-min.css'
import './styles.css'

class ShopOwnerPage extends Component {
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
      const { actions } = this.props
      this.getAllShopsByOwner()
      actions.getAllProductsByShop({
        shopId: 1,
        account,
        contractInstance })
      actions.getUserStatus({ contractInstance, account })
      actions.checkShopBalance({ shopId: 1, account, contractInstance })
    } catch (e) {
      displayError('Error finding web3 or instatiating the contract.', e.message)
      console.log('Error finding web3 or instatiating the contract.', e.message)
    }
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
    const { modal, shops, actions, loading, userStatus } = this.props
    const { contractInstance, account } = this.state
    if (loading.userStatus === true) {
      return (
        <Layout>
          <h3>Loading...</h3>
        </Layout>)
    }

    if (userStatus !== 'owner') {
      return (
        <Layout>
          <AdminTestPanel
            userStatus={userStatus}
            loading={loading.adminPanelAction}
            makeMyselfAdmin={() => (actions.makeMyselfAdmin({ contractInstance, account }))}
            makeMyselfShopOwner={() => (actions.makeMyselfShopOwner({ contractInstance, account }))}
            makeMyselfUser={() => (actions.makeMyselfRegularUser({ contractInstance, account }))}
          />
          <br />
          <h3>You do not have Shop Owner privileges. For testing purposes you can <b>Make youself a Shop Owner</b> in the <b>Admin Test Panel</b> at the top of the page to use features on this page.</h3>
        </Layout>)
    }
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
        </div>
        <AdminTestPanel
          userStatus={userStatus}
          loading={loading.adminPanelAction}
          makeMyselfAdmin={() => (actions.makeMyselfAdmin({ contractInstance, account }))}
          makeMyselfShopOwner={() => (actions.makeMyselfShopOwner({ contractInstance, account }))}
          makeMyselfUser={() => (actions.makeMyselfRegularUser({ contractInstance, account }))}
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
        <DefaultModal
          active={modal.active}
          header={modal.header}
          body={modal.body}
        />
      </Layout>
    )
  }
}

ShopOwnerPage.defaultProps = {
  user: null,
  // userAcctBalance: null
}

ShopOwnerPage.propTypes = {
  userStatus: PropTypes.string.isRequired,
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
    withdrawBalance,
    makeMyselfAdmin,
    makeMyselfShopOwner,
    makeMyselfRegularUser,
    getUserStatus
  }, dispatch),
})

const mapStateToProps = (state) => ({
  user: state.user.data,
  userStatus: state.user.userStatus,
  modal: state.modal,
  userAcctBalance: state.user.userAcctBalance,
  shops: state.shops,
  loading: state.loading
})

export default connect(mapStateToProps, mapDispatchToProps)(ShopOwnerPage)


/* <HomeBody
updateValue={(value) => (this.handleClick(value))}
storageValue={this.state.storageValue}
makeMyselfAdmin={() => (this.makeMyselfAdmin())}
makeMyselfShopOwner={() => (this.makeMyselfShopOwner())}
userData={user}
userAcctBalance={userAcctBalance}
/> */