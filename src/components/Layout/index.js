import React from 'react'
import PropTypes from 'prop-types'

import Nav from '../Nav'

// styles
import { StyledPadding } from './styles'

const Layout = (props) => (
  <div>
    <Nav />
    <StyledPadding>
      {props.children}
    </StyledPadding>
  </div>
)

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
}

export default Layout