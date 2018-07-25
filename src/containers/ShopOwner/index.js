import React, { Component } from 'react'
import { connect } from 'react-redux'
import Layout from '../../components/Layout'

class ShopOwner extends Component {
  render() {
    return (
      <Layout>
        <div>
          Shop Owner Page
        </div>
      </Layout>
    )
  }
}

export default connect()(ShopOwner)
