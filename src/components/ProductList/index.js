import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import Button from 'antd/lib/button'

// styles
import { StyledContainer, StyledProduct, StyledProductList } from './styles'

const ProductList = ({ productList, shopId }) => {
  const title = productList.length > 0 ? 'Available Products' : 'This shop currently does not have any products.'
  return (
    <div>
      <StyledProductList title={title}>
        <StyledContainer>
          {productList.length > 0 &&
          productList.map((x) => (
            <StyledProduct key={x.id} title={x.name}>
              <p>id: {x.id}</p>
              <p>Price: {x.price}</p>
              <p>Description: {x.description}</p>
              <Button type="primary" onClick={() => (browserHistory.push(`shop/${shopId}/product/${x.id}`))}>View</Button>
            </StyledProduct>
          ))}
        </StyledContainer>
      </StyledProductList>
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