import { browserHistory } from 'react-router'
import { uport } from './../../../../util/connectors'

const mnid = require('mnid')


export const USER_LOGGED_IN = 'USER_LOGGED_IN'
function userLoggedIn(user) {
  const ethAddress = mnid.decode(user.address).address // decode uport address into an eth address
  return {
    type: USER_LOGGED_IN,
    payload: {
      ...user,
      ethAddress
    }
  }
}

export function loginUser() {
  return (dispatch) => {
    // UPort and its web3 instance are defined in ./../../../util/wrappers.
    // Request uPort persona of account passed via QR
    uport.requestCredentials({
      requested: ['name', 'phone', 'country'],
      notifications: true // We want this if we want to recieve credentials
    }).then((credentials) => {
      dispatch(userLoggedIn(credentials))

      // Used a manual redirect here as opposed to a wrapper.
      // This way, once logged in a user can still access the home page.
      const currentLocation = browserHistory.getCurrentLocation()

      if ('redirect' in currentLocation.query) {
        return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
      }

      return browserHistory.push('/dashboard')
    })
  }
}
