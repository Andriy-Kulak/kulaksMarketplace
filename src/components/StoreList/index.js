import React from 'react'
import PropTypes from 'prop-types'
import { StyledContainer } from './styles'

const StoreList = ({ storeList }) => {
  return (
    <StyledContainer>
      <h2>Stores Owned:</h2>
      {storeList.map((x) => (
        <div key={x.id}>
          <h3>Name: {x.name}</h3>
          <p>id: {x.id}</p>
          <p>Type: {x.type}</p>
          <p>Description: {x.description}</p>
        </div>
      ))}
    </StyledContainer>
  )
}

StoreList.propTypes = {
  storeList: PropTypes.array.isRequired
}

export default StoreList