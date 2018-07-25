import React from 'react'
import PropTypes from 'prop-types'
import Tabs from 'antd/lib/tabs'
import Icon from 'antd/lib/icon'

// styles
import { StyledContainer, StyledNoShopsWarn, StyledTabs } from './styles'

// components
import CreateProduct from '../CreateProduct'
import ProductList from '../ProductList'
import CreateStore from '../CreateStore'


const ShopList = ({ shopList, productList, createProduct, selectShop, createShop, shopBalances, withdrawBalance }) => {
  const { TabPane } = Tabs

  return (
    <div>
      <h1>Shop Owner Panel</h1>
      <h2>Shops:</h2>
      {!shopList.length > 0 &&
      <StyledNoShopsWarn>You do not have any existing shop. Create a new one below!</StyledNoShopsWarn>}
      <StyledContainer>
        <StyledTabs
          defaultActiveKey="1"
          tabPosition="top"
          type="card"
          onTabClick={(value) => (selectShop(value))}
        >
          {shopList.map((x) => (
            <TabPane tab={x.name} key={x.id}>
              <h4>Type: {x.type}</h4>
              <p>Description: {x.description}</p>
              {typeof shopBalances[x.id] === 'number' &&
              <span>
                <p>Shop Balance: {shopBalances[x.id]} wei</p>
                <button onClick={() => (withdrawBalance(x.id))}>Withdraw Balance</button>
              </span>}
              <ProductList productList={productList[x.id]} shopId={x.id} />
              <CreateProduct onSubmit={(values) => (createProduct({ ...values, shopId: x.id }))} />
            </TabPane>))}
          <TabPane
            tab={<span><Icon type="plus-square" />Create New Shop</span>}
            key="newShop"
          >
            <CreateStore onSubmit={(values) => (createShop(values))} />
          </TabPane>
        </StyledTabs>
      </StyledContainer>
    </div>
  )
}

ShopList.propTypes = {
  shopList: PropTypes.array.isRequired,
  createProduct: PropTypes.func.isRequired,
  selectShop: PropTypes.func.isRequired,
  createShop: PropTypes.func.isRequired,
  productList: PropTypes.object.isRequired,
  withdrawBalance: PropTypes.func.isRequired
}

export default ShopList
