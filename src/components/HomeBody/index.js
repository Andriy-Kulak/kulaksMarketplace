import React, { Component } from 'react'
import PropTypes from 'prop-types'

class HomeBody extends Component {
  constructor() {
    super()
    this.state = {
      key: 1
    }
  }
  render() {
    const { makeMyselfAdmin, updateValue, storageValue, makeMyselfShopOwner, userData, userAcctBalance } = this.props
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Good to Go!</h1>
            <p>Your Truffle Box is installed and ready.</p>
            <div>
              <p>The stored value is: {storageValue}</p>
            </div>
            <h2> ----------------------------- </h2>
            <button onClick={() => (makeMyselfAdmin())}>Make Myself Admin</button>
            <button onClick={() => (makeMyselfShopOwner())}>Make Myself Shop Owner</button>
            <button onClick={() => (updateValue(20))}>Update Value to 20</button>
            <h2> ----------------------------- </h2>
            {userAcctBalance !== null &&
            <div>
              The user's account currently has: {userAcctBalance} Eth
            </div>}
            <h3>Redirect Path</h3>
            <p>This example redirects home ("/") when trying to access an authenticated route without first authenticating. You can change this path in the failureRedirectUrl property of the UserIsAuthenticated wrapper on <strong>line 9</strong> of util/wrappers.js.</p>
          </div>
        </div>
      </main>
    )
  }
}

HomeBody.propTypes = {
  makeMyselfAdmin: PropTypes.func.isRequired,
  updateValue: PropTypes.func.isRequired,
  storageValue: PropTypes.number.isRequired,
  makeMyselfShopOwner: PropTypes.func.isRequired
}

export default HomeBody
