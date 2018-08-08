import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Card from 'antd/lib/card'
import Button from 'antd/lib/button'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import Layout from '../../components/Layout'
import getWeb3 from '../../util/getWeb3'
import instantiateContract from '../../util/instantiateContract'
import { displayError } from '../../util/displayMessage'
import MarketplaceContract from '../../contracts/KulaksMarketplace.json'
import { getAllShops } from '../../redux/shops/actions'

import { StyledContainerList } from './styles'


class HomePage extends Component {
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

      console.log('GETTTTTTTTTTTTTTTTT')
      const { actions } = this.props
      actions.getAllShops({ contractInstance, account })
    } catch (e) {
      displayError('Error finding web3 or instatiating the contract.', e.message)
      console.log('Error finding web3 or instatiating the contract.', e.message)
    }
  }
  render() {
    const { userShops } = this.props
    const title = userShops.length === 0 ?
      'There are currently no stores created. If you want to test the app, then become a Shop Owner and Create Shops and Products.' :
      'Available Shops'
    return (
      <Layout>
        <Card title={title}>
          <StyledContainerList>
            {userShops.map((x) => (
              <Card key={x.id} title={x.name}>
                <p>id: {x.id}</p>
                <p>Owner: {x.owner}</p>
                <p>Type: {x.type}</p>
                <p>Shop Description: {x.description}</p>
                <Button type="primary" onClick={() => (browserHistory.push(`shop/${x.id}`))}>View</Button>
              </Card>))}
          </StyledContainerList>
        </Card>
      </Layout>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    getAllShops
    // loadingModal,
    // getUserBalance,
    // createShop,
    // getAllShopsByOwner,
    // createProduct,
    // getAllProductsByShop,
    // checkShopBalance,
    // withdrawBalance
  }, dispatch),
})

const mapStateToProps = (state) => ({
  // user: state.user.data,
  // modal: state.modal,
  // userAcctBalance: state.user.userAcctBalance,
  userShops: state.shops.userShops,
  // loading: state.loading
})

HomePage.propTypes = {
  userShops: PropTypes.array.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)

