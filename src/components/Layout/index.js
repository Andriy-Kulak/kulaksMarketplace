import React from 'react'
import PropTypes from 'prop-types'

import Nav from '../Nav'

// styles

const Layout = (props) => (
  <div>
    <Nav />
    {props.children}
  </div>
)

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]).isRequired,
}

export default Layout