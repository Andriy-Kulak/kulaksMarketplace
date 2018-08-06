import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import Select from 'antd/lib/select'
// import Divider from 'antd/lib/divider'
// import Button from 'antd/lib/button'
import PropTypes from 'prop-types'
import { displayError } from '../../util/displayMessage'
import MarketplaceContract from '../../contracts/KulaksMarketplace.json'
import getWeb3 from '../../util/getWeb3'
import instantiateContract from '../../util/instantiateContract'

// actions
// import { selectProduct, clearExistingProduct, purchaseProduct } from '../../redux/shops/actions'

// components
import Layout from '../../components/Layout'

// styles
import { StyledContainer } from './styles'

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
      // const { actions, params: { productId }, selectedProduct } = this.props
      // if (selectedProduct.id !== productId) {
      //   actions.clearExistingProduct()
      //   actions.selectProduct({ contractInstance, productId, account })
      // }
    } catch (e) {
      displayError('Error finding web3 or instatiating the contract.', e.message)
      console.log('Error finding web3 or instatiating the contract.', e.message)
    }
  }

  // purchaseProduct = async (totalCost) => {
  //   const { contractInstance, account, quantity } = this.state
  //   const { params: { productId }, actions } = this.props
  //   actions.purchaseProduct({ contractInstance, quantity, totalCost, account, productId })
  // }

  checkShopBalance = async (shopId) => {
    const { contractInstance, account } = this.state
    const result = await contractInstance.shopBalances(shopId, { from: account })
    console.log('CHECK SHOP BALANCE RESULT', result)
    console.log('DETAILED RESULT', result.c[0])
  }

  render() {
    return (
      <Layout>
        <StyledContainer>
          <h3> Admin Page</h3>
        </StyledContainer>
      </Layout>
    )
  }
}

ProductPage.propTypes = {
  // selectedProduct: PropTypes.object.isRequired,
  // loading: PropTypes.object.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
  }, dispatch),
})

const mapStateToProps = (state) => ({
  user: state.user.data,
  // modal: state.modal,
  // loading: state.loading,
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)