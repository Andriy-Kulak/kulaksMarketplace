import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyledContainer } from './styles'
import CreateProduct from '../CreateProduct'

class ShopList extends Component {
  constructor() {
    super()
    this.state = {
      create: false,
      selectedStore: null
    }
  }
  render() {
    console.log('this.state ==========>', this.state)
    const { create, selectedStore } = this.state
    const { shopList } = this.props
    return (
      <div>
        <h2>Stores Owned:</h2>
        <StyledContainer>
          {shopList.map((x) => (
            <div key={x.id}>
              <h3>Name: {x.name}</h3>
              <p>id: {x.id}</p>
              <p>Type: {x.type}</p>
              <p>Description: {x.description}</p>
              <button onClick={() => (this.setState({ ...this.state, create: true, selectedStore: x.id }))}>Create New Product</button>
              {create === true && x.id === selectedStore &&
              <CreateProduct onSubmit={(values) => (this.props.createProduct({ ...values, shopId: selectedStore }))} />}
              <br />
              <button onClick={() => (this.props.selectShop(x.id))}>View Store Products</button>
            </div>
          ))}
        </StyledContainer>
      </div>
    )
  }
}

ShopList.propTypes = {
  shopList: PropTypes.array.isRequired,
  createProduct: PropTypes.func.isRequired,
  selectShop: PropTypes.func.isRequired
}

export default ShopList