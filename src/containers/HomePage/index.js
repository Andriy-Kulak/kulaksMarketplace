import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Card from 'antd/lib/card'
import Button from 'antd/lib/button'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import getWeb3 from '../../util/getWeb3'
import instantiateContract from '../../util/instantiateContract'
import { displayError } from '../../util/displayMessage'
import MarketplaceContract from '../../contracts/KulaksMarketplace.json'

// styles
import { StyledContainerList } from './styles'

// actions
import {
  getUserStatus,
  makeMyselfAdmin,
  makeMyselfShopOwner,
  makeMyselfRegularUser
} from '../../redux/user/actions'
import { getAllShops } from '../../redux/shops/actions'

// components
import AdminTestPanel from '../../components/AdminTestPanel'
import Layout from '../../components/Layout'

class HomePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      contractInstance: null,
      account: null,
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
      actions.getAllShops({ contractInstance, account })
      actions.getUserStatus({ contractInstance, account })
    } catch (e) {
      displayError('Error finding web3 or instatiating the contract.', e.message)
      console.log('Error finding web3 or instatiating the contract.', e.message)
    }
  }
  render() {
    const { userShops, actions, userStatus, loading } = this.props
    const { contractInstance, account } = this.state
    console.log('CONTRACT INSTANCE', contractInstance)
    const title = userShops.length === 0 ?
      'There are currently no stores created. If you want to test the app, then become a Shop Owner by heading over to Shop Owner page and Create Shops and Products.' :
      'Available Shops'
    return (
      <Layout>
        <AdminTestPanel
          userStatus={userStatus}
          loading={loading.adminPanelAction}
          makeMyselfAdmin={() => (actions.makeMyselfAdmin({ contractInstance, account }))}
          makeMyselfShopOwner={() => (actions.makeMyselfShopOwner({ contractInstance, account }))}
          makeMyselfUser={() => (actions.makeMyselfRegularUser({ contractInstance, account }))}
        />
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
    getAllShops,
    getUserStatus,
    makeMyselfAdmin,
    makeMyselfShopOwner,
    makeMyselfRegularUser
  }, dispatch),
})

const mapStateToProps = (state) => ({
  userShops: state.shops.userShops,
  userStatus: state.user.userStatus,
  loading: state.loading
})

HomePage.propTypes = {
  userShops: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  userStatus: PropTypes.string.isRequired,
  loading: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage)

