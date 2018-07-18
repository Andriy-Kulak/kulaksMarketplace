import React from 'react'
import PropTypes from 'prop-types'
import { StyledContainer } from './styles'

const ShopList = ({ shopList }) => {
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
          </div>
        ))}
      </StyledContainer>
    </div>
  )
}

ShopList.propTypes = {
  shopList: PropTypes.array.isRequired
}

export default ShopList