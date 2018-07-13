import React from 'react'
import PropTypes from 'prop-types'

const LogoutButton = ({ onLogoutUserClick }) => {
  return (
    <li className="pure-menu-item">
      <a href="#" className="pure-menu-link" onClick={(event) => onLogoutUserClick(event)}>Logout</a>
    </li>)
}

LogoutButton.propTypes = {
  onLogoutUserClick: PropTypes.func.isRequired
}

export default LogoutButton
