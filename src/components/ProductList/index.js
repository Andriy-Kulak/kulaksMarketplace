import React from 'react'
import PropTypes from 'prop-types'
import { StyledContainer, StyledProduct } from './styles'

const ProductList = ({ productList }) => {
  return (
    <div>
      {productList.length === 0 &&
        <h3>This shop currently does not have any products. Create a Product below.</h3>}
      {productList.length > 0 && <h2>Available Products</h2>}
      <StyledContainer>
        {productList.length > 0 &&
        productList.map((x) => (
          <StyledProduct key={x.id}>
            <h3>Name: {x.name}</h3>
            <p>id: {x.id}</p>
            <p>Type: {x.price}</p>
            <p>Description: {x.description}</p>
          </StyledProduct>
        ))}
      </StyledContainer>
    </div>
  )
}

ProductList.defaultProps = {
  productList: []
}

ProductList.propTypes = {
  productList: PropTypes.array,
}

export default ProductList