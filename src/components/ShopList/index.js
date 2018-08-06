import React from 'react'
import PropTypes from 'prop-types'
import Tabs from 'antd/lib/tabs'
import Icon from 'antd/lib/icon'
import Button from 'antd/lib/button'

// styles
import {
  StyledContainer,
  StyledNoShopsWarn,
  StyledTabs,
  StyledShopContainer,
  StyledShopDetails
} from './styles'

// components
import CreateProduct from '../CreateProduct'
import ProductList from '../ProductList'
import CreateStore from '../CreateStore'


const ShopList = ({ shopList, productList, createProduct, selectShop, createShop, shopBalances, withdrawBalance, loading }) => {
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
              <StyledShopContainer>
                <StyledShopDetails title="Shop Details">
                  <h4>Type: {x.type}</h4>
                  <p>Description: {x.description}</p>
                  {typeof shopBalances[x.id] === 'number' &&
                  <span>
                    <p>Shop Balance: {shopBalances[x.id]} wei</p>
                    <Button disabled={shopBalances[x.id] === 0} type="primary" onClick={() => (withdrawBalance(x.id))}>Withdraw Balance</Button>
                    {shopBalances[x.id] === 0 &&
                    <p>
                      * Your shop balance is 0.<br /> There is nothing currently to withdraw.
                    </p>}
                  </span>}
                </StyledShopDetails>
                <div>
                  <ProductList productList={productList[x.id]} shopId={x.id} />
                </div>
              </StyledShopContainer>
              <CreateProduct onSubmit={(values) => (createProduct({ ...values, shopId: x.id }))} loading={loading.newProduct} />
            </TabPane>))}
          <TabPane
            tab={<span><Icon type="plus-square" />Create New Shop</span>}
            key="newShop"
          >
            <CreateStore onSubmit={(values) => (createShop(values))} loading={loading.newShop} />
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
  withdrawBalance: PropTypes.func.isRequired,
  shopBalances: PropTypes.number.isRequired,
  loading: PropTypes.object.isRequired
}

export default ShopList
