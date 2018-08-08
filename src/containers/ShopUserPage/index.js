import React from 'react'

// components
import Layout from '../../components/Layout'

const ShopUserPage = ({ params: { shopId }}) => {
  return (
    <Layout>
      <h3> SHOP USSERRE PAGE. SHOP ID: {shopId}</h3>
    </Layout>
  )
}

export default ShopUserPage