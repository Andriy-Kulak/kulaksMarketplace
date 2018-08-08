import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Card from 'antd/lib/card'
import { displayError } from '../../util/displayMessage'
import MarketplaceContract from '../../contracts/KulaksMarketplace.json'
import getWeb3 from '../../util/getWeb3'
import instantiateContract from '../../util/instantiateContract'

// components
import Layout from '../../components/Layout'
import ProductList from '../../components/ProductList'

import {
  getAllProductsByShop,
  getSpecificShop
} from '../../redux/shops/actions'

class ShopUserPage extends Component {
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
      const { actions, params: { shopId } } = this.props
      actions.getAllProductsByShop({ shopId, account, contractInstance }) // get all shop details
      actions.getSpecificShop({ contractInstance, account, shopId }) // get details of shop
    } catch (e) {
      displayError('Error finding web3 or instatiating the contract.', e.message)
      console.log('Error finding web3 or instatiating the contract.', e.message)
    }
  }
  render() {
    const { params: { shopId }, productList, shopDetails } = this.props
    const title = shopDetails.name ? `Shop Name: ${shopDetails.name}` : '...'
    const description = shopDetails.description ? `Shop Description: ${shopDetails.description}` : '...'
    return (
      <Layout>
        <Card title={title}>
          <p>{description}</p>
          <ProductList productList={productList[shopId]} shopId={shopId} />
        </Card>
      </Layout>
    )
  }
}

ShopUserPage.propTypes = {
  params: PropTypes.object.isRequired,
  productList: PropTypes.array.isRequired,
  shopDetails: PropTypes.object.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    getAllProductsByShop,
    getSpecificShop
  }, dispatch),
})

const mapStateToProps = (state) => ({
  productList: state.shops.products,
  shopDetails: state.shops.shopDetails
})

export default connect(mapStateToProps, mapDispatchToProps)(ShopUserPage)