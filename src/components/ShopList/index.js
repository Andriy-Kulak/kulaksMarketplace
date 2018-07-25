import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Tabs from 'antd/lib/tabs'
import Icon from 'antd/lib/icon'
import { StyledContainer } from './styles'
import CreateProduct from '../CreateProduct'
import ProductList from '../../components/ProductList'
import CreateStore from '../../components/CreateStore'


const ShopList = ({ shopList, productList, createProduct, selectShop, createShop }) => {
  const { TabPane } = Tabs

  return (
    <div>
      <h1>Admin Panel</h1>
      <h2>Shops:</h2>
      <StyledContainer>
        <Tabs
          defaultActiveKey="1"
          tabPosition="top"
          type="card"
          onTabClick={(value) => (selectShop(value))}
        >
          {shopList.map((x) => (
            <TabPane tab={x.name} key={x.id}>
              <h4>Type: {x.type}</h4>
              <p>Description: {x.description}</p>
              <ProductList productList={productList[x.id]} shopId={x.id} />
              <CreateProduct onSubmit={(values) => (createProduct({ ...values, shopId: x.id }))} />
            </TabPane>))}
          <TabPane
            tab={<span><Icon type="plus-square" />Create New Shop</span>}
            key="newShop"
          >
            <CreateStore doShopsExist={shopList.length > 0} onSubmit={(values) => (createShop(values))} />
          </TabPane>
        </Tabs>
      </StyledContainer>
    </div>
  )
}

ShopList.propTypes = {
  shopList: PropTypes.array.isRequired,
  createProduct: PropTypes.func.isRequired,
  selectShop: PropTypes.func.isRequired,
  createShop: PropTypes.func.isRequired,
  productList: PropTypes.object.isRequired
}

export default ShopList
