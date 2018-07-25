import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'

// styles
import { StyledContainer, StyledProduct, StyledNoProductsWarn } from './styles'

const ProductList = ({ productList, shopId }) => {
  return (
    <div>
      {productList.length === 0 &&
        <StyledNoProductsWarn>
          This shop currently does not have any products. Create a Product below.
        </StyledNoProductsWarn>}
      {productList.length > 0 && <h2>Available Products</h2>}
      <StyledContainer>
        {productList.length > 0 &&
        productList.map((x) => (
          <StyledProduct key={x.id}>
            <h3>Name: {x.name}</h3>
            <p>id: {x.id}</p>
            <p>Price: {x.price}</p>
            <p>Description: {x.description}</p>
            <button onClick={() => (browserHistory.push(`shop/${shopId}/product/${x.id}`))}>View</button>
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
  shopId: PropTypes.number.isRequired
}

export default ProductList