import React from 'react'
import PropTypes from 'prop-types'
// Images
import uPortLogo from '../../../../img/uport-logo.svg'

const LoginButton = ({ onLoginUserClick }) => {
  return (
    <li className="pure-menu-item">
      <a href="#" className="pure-menu-link" onClick={(event) => onLoginUserClick(event)}><img className="uport-logo" src={uPortLogo} alt="UPort Logo" />Login with UPort</a>
    </li>
  )
}

LoginButton.propTypes = {
  onLoginUserClick: PropTypes.func.isRequired
}

export default LoginButton
