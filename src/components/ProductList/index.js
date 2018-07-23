import React from 'react'
import PropTypes from 'prop-types'
import { StyledContainer } from './styles'

const ProductList = ({ productList, shopId, shopName }) => {
  return (
    <div>
      <h2>Products for: {shopName}</h2>
      <StyledContainer>
        {productList &&
        productList[shopId] &&
        productList[shopId].map((x) => (
          <div key={x.id}>
            <h3>Name: {x.name}</h3>
            <p>id: {x.id}</p>
            <p>Type: {x.price}</p>
            <p>Description: {x.description}</p>
          </div>
        ))}
      </StyledContainer>
    </div>
  )
}

ProductList.propTypes = {
  productList: PropTypes.object.isRequired,
  shopId: PropTypes.number.isRequired,
  shopName: PropTypes.string.isRequired
}

export default ProductList