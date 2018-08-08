import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../components/Layout'
import getWeb3 from '../../util/getWeb3'
import instantiateContract from '../../util/instantiateContract'
import { displayError } from '../../util/displayMessage'
import MarketplaceContract from '../../contracts/KulaksMarketplace.json'

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

      const { actions } = this.props
      // actions.getAllUsers({ contractInstance, account })
    } catch (e) {
      displayError('Error finding web3 or instatiating the contract.', e.message)
      console.log('Error finding web3 or instatiating the contract.', e.message)
    }
  }
  render() {
    return (
      <Layout>
        <div>
          Home Page
        </div>
      </Layout>
    )
  }
}

export default connect()(HomePage)
