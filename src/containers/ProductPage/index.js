import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Select from 'antd/lib/select'
import Divider from 'antd/lib/divider'
import Button from 'antd/lib/button'
import PropTypes from 'prop-types'
import { displayError } from '../../util/displayMessage'
import MarketplaceContract from '../../contracts/KulaksMarketplace.json'
import getWeb3 from '../../util/getWeb3'
import instantiateContract from '../../util/instantiateContract'

// actions
import { selectProduct, clearExistingProduct, purchaseProduct } from '../../redux/shops/actions'

// components
import Layout from '../../components/Layout'

// styles
import { StyledContainer, StyledProduct, StyledInfo } from './styles'

class ProductPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      contractInstance: null,
      account: null,
      quantity: 1,
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
      const { actions, params: { productId }, selectedProduct } = this.props
      if (selectedProduct.id !== productId) {
        actions.clearExistingProduct()
        actions.selectProduct({ contractInstance, productId, account })
      }
    } catch (e) {
      displayError('Error finding web3 or instatiating the contract.', e.message)
      console.log('Error finding web3 or instatiating the contract.', e.message)
    }
  }

  purchaseProduct = async (totalCost) => {
    const { contractInstance, account, quantity } = this.state
    const { params: { productId }, actions } = this.props
    actions.purchaseProduct({ contractInstance, quantity, totalCost, account, productId })
  }

  checkShopBalance = async (shopId) => {
    const { contractInstance, account } = this.state
    const result = await contractInstance.shopBalances(shopId, { from: account })
    console.log('CHECK SHOP BALANCE RESULT', result)
    console.log('DETAILED RESULT', result.c[0])
  }

  render() {
    const { quantity } = this.state
    const { selectedProduct: { id, name, description, price }, loading } = this.props
    const { Option } = Select
    const availableQuantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const subtotalCost = price ? price * quantity : 0
    const totalCost = subtotalCost + 20 // Shipping and handling fees
    return (
      <Layout>
        <StyledContainer>
          <StyledProduct title={`Product Title: ${name}`}>
            <p>Id: {id}</p>
            <p>Description: {description}</p>
            Quantity:
            <Select defaultValue={1} style={{ width: 120 }} onChange={(value) => (this.setState({ ...this.state, quantity: value }))}>
              {availableQuantities.map((x) => (
                <Option key={x} value={x}>{x}</Option>
              ))}
            </Select>
            <Divider />
            {subtotalCost > 0 &&
              <div style={{ textAlign: 'right' }}>
                <h4>Subtotal: {subtotalCost} (in wei)</h4>
                <h4>Total Cost (S&H Included): {totalCost} (in wei)</h4>
                <Button type="primary" loading={loading.purchaseProduct} onClick={() => (this.purchaseProduct(totalCost))}>
                  {loading.purchaseProduct ? 'Purchasing...' : 'Purchase'}
                </Button>
              </div>}
            <StyledInfo>(For testing purposes only) If you want to test the shop owner feature of withdrawal, then purchase and item, head over to Shop Owner page and withdraw the total balance that users have purchased from the store.</StyledInfo>
          </StyledProduct>
        </StyledContainer>
      </Layout>
    )
  }
}

ProductPage.propTypes = {
  selectedProduct: PropTypes.object.isRequired,
  loading: PropTypes.object.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    selectProduct,
    clearExistingProduct,
    purchaseProduct
  }, dispatch),
})

const mapStateToProps = (state) => ({
  user: state.user.data,
  modal: state.modal,
  loading: state.loading,
  userAcctBalance: state.user.userAcctBalance,
  selectedProduct: state.shops.selectedProduct
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)