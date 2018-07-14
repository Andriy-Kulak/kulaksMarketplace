import { browserHistory } from 'react-router'
import { uport } from '../../util/connectors'
import { UPDATE_USER_BALANCE, USER_LOGGED_IN } from './constants'

const mnid = require('mnid')

const updateBalance = (balance) => {
  return {
    type: UPDATE_USER_BALANCE,
    payload: balance
  }
}

export const getUserBalance = (web3, ethAddress) => {
  return (dispatch) => {
    web3.eth.getBalance(ethAddress, (error, result) => {
      if (!error) {
        const parsedResult = (typeof result === 'string' && result.length > 0) ? parseInt(result, 10) : result
        return dispatch(updateBalance(parsedResult))
      }
    })
  }
}

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
