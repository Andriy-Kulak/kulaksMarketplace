import React from 'react'
import { Link } from 'react-router'
// UI Components
import LoginButtonContainer from '../User/ui/loginbutton/LoginButtonContainer'
import LogoutButtonContainer from '../User/ui/logoutbutton/LogoutButtonContainer'
import { HiddenOnlyAuth, VisibleOnlyAuth } from '../../util/wrappers'

const Nav = () => {
  const OnlyAuthLinks = VisibleOnlyAuth(() =>(
    <span>
      <li className="pure-menu-item">
        <Link to="/dashboard" className="pure-menu-link">Dashboard</Link>
      </li>
      <li className="pure-menu-item">
        <Link to="/profile" className="pure-menu-link">Profile</Link>
      </li>
      <LogoutButtonContainer />
    </span>)
  )

  const OnlyGuestLinks = HiddenOnlyAuth(() =>(
    <span>
      <LoginButtonContainer />
    </span>)
  )
  return (
    <nav className="navbar pure-menu pure-menu-horizontal">
      <Link to="/" className="pure-menu-heading pure-menu-link">Truffle Scaffold with UPort and eth Contract</Link>
      <ul className="pure-menu-list navbar-right">
        <li className="pure-menu-item">
          <Link to="/shopowner" className="pure-menu-heading pure-menu-link">Shop Owner</Link>
        </li>
        <OnlyGuestLinks />
        <OnlyAuthLinks />
      </ul>
    </nav>
  )
}

export default Nav
