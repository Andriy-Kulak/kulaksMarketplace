import React, { Component } from 'react'
import { connect } from 'react-redux'
import MarketplaceContract from '../../contracts/KulaksMarketplace.json'
import getWeb3 from '../../util/getWeb3'
import instantiateContract from '../../util/instantiateContract'

// components
import Layout from '../../components/Layout'

class ProductPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      contractInstance: null,
      account: null
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
  render() {
    console.log('THIS STATE PRODUCT PAGE', this.state)
    console.log(' this.props',  this.props)
    const { shops, params: { productId, shopId } } = this.props
    return (
      <Layout>
        PRODUCT PAGE
        {/* {shops[shopId] && shops[shopId][productId] &&

        } */}
      </Layout>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user.data,
  modal: state.modal,
  userAcctBalance: state.user.userAcctBalance,
  shops: state.shops
})

export default connect(mapStateToProps)(ProductPage)