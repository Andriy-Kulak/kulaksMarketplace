import { browserHistory } from 'react-router'
import { reset } from 'redux-form'
import { uport } from '../../util/connectors'
import { displayError, displaySuccess } from '../../util/displayMessage'
import { startLoading, finishLoading, clearAllLoading } from '../loading/actions'

import {
  UPDATE_USER_BALANCE,
  USER_LOGGED_IN,
  UPDATE_USER_STATUS,
  UPDATE_ADMIN_LIST
} from './constants'

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

export function getAllUsers({ contractInstance, account }) {
  return async (dispatch) => {
    const result = await contractInstance.getUsersListLength({ from: account })

    const userListArray = []
    const userAccountArray = []
    const userDetailedList = []
    if (result.c && result.c[0]) {
      const lengthOfArray = result.toNumber()
      let counter = 0

      while (counter < lengthOfArray) {
        userListArray.push(contractInstance.usersList(counter, { from: account }))
        counter += 1
      }
      const userAcctResp = await Promise.all(userListArray)
      console.log('userAcctResp ====>', userAcctResp)


      userAcctResp.forEach((x) => {
        userAccountArray.push(contractInstance.users(x, { from: account }))
      })
      const userResp = await Promise.all(userAccountArray)

      console.log('userResp ===?', userResp)
      if (userResp.length !== userAcctResp.length) {
        displayError('There was an Error getting user account statuses. Please investigate')
        console.log('userResp ====>', userResp)
        console.log('userAcctResp ====>', userAcctResp)
      }

      userAcctResp.forEach((x, key) => {
        userDetailedList.push({
          account: x,
          status: userResp[key]
        })
      })

      console.log('userDetailedList ===>', userDetailedList)
      dispatch({
        type: UPDATE_ADMIN_LIST,
        payload: userDetailedList
      })
    }
  }
}

export function makeAdmin({ contractInstance, account, userAccount }) {
  return async (dispatch) => {
    try {
      dispatch(startLoading('adminListAction'))
      const result = await contractInstance.makeAdmin(userAccount, { from: account, gas: 550000 })

      if (result.receipt) {
        displaySuccess(`You have successfully made the following account an admin: ${userAccount}`)
        dispatch(getAllUsers({ contractInstance, account }))
        dispatch(reset('addAccount')) // reset add account redux-form
      } else {
        displayError()
        console.log('RESULT FROM CREATING ADMIN', result)
      }
      dispatch(finishLoading('adminListAction'))
    } catch (e) {
      displayError(e.message)
      dispatch(clearAllLoading())
      console.log('ERROR CREATING AN ADMIN', e)
    }
  }
}

export function makeShopOwner({ contractInstance, account, userAccount }) {
  return async (dispatch) => {
    try {
      dispatch(startLoading('adminListAction'))
      const result = await contractInstance.makeShopOwner(userAccount, { from: account, gas: 550000 })

      if (result.receipt) {
        displaySuccess(`You have successfully made the following account a Shop Owner: ${userAccount}`)
        dispatch(getAllUsers({ contractInstance, account }))
        dispatch(reset('addAccount')) // reset add account redux-form
      } else {
        displayError()
        console.log('RESULT FROM CREATING A SHOP OWNER', result)
      }
      dispatch(finishLoading('adminListAction'))
    } catch (e) {
      displayError(e.message)
      dispatch(clearAllLoading())
      console.log('ERROR CREATING A SHOP OWNER', e)
    }
  }
}

export function makeUser({ contractInstance, account, userAccount }) {
  return async (dispatch) => {
    try {
      dispatch(startLoading('adminListAction'))
      const result = await contractInstance.makeShopper(userAccount, { from: account, gas: 550000 })

      if (result.receipt) {
        displaySuccess(`You have successfully made the following account a User: ${userAccount}`)
        dispatch(getAllUsers({ contractInstance, account }))
        dispatch(reset('addAccount')) // reset add account redux-form
      } else {
        displayError()
        console.log('RESULT FROM CREATING USER', result)
      }
      dispatch(finishLoading('adminListAction'))
    } catch (e) {
      displayError(e.message)
      dispatch(clearAllLoading())
      console.log('ERROR CREATING A USER', e)
    }
  }
}


export function getUserStatus({ contractInstance, account }) {
  return async (dispatch) => {
    try {
      dispatch(startLoading('userStatus'))
      const result = await contractInstance.users(account, { from: account })
      console.log('TEST 33333333', result)
      if (result === 'owner' || result === 'admin' || result === 'shopper') {
        dispatch({
          type: UPDATE_USER_STATUS,
          payload: result
        })
      } else {
        // if type is not admin, owner, or shopper then make user a guest
        dispatch({
          type: UPDATE_USER_STATUS,
          payload: 'guest'
        })
      }
      dispatch(finishLoading('userStatus'))
    } catch (e) {
      displayError(e.message)
      dispatch(clearAllLoading())
      console.log('ERROR GETTING STATUS OF A USER', e)
    }
  }
}


export function makeMyselfAdmin({ contractInstance, account }) {
  return async (dispatch) => {
    try {
      dispatch(startLoading('adminPanelAction'))
      const result = await contractInstance.becomeAdmin({ from: account })
      if (result.receipt) {
        displaySuccess('You successfuly made youself an admin')
        dispatch(getUserStatus({ contractInstance, account }))
        browserHistory.push('/admin')
      } else {
        displayError('There was an error making you admin. Check response in console log')
        console.log('RESPONSE FROM MAKING MYSELF ADMIN', result)
      }
      dispatch(finishLoading('adminPanelAction'))
    } catch (e) {
      displayError(e.message)
      dispatch(clearAllLoading())
      console.log('ERROR MAKING MYSELF AN ADMIN', e)
    }
  }
}

export function makeMyselfShopOwner({ contractInstance, account }) {
  return async (dispatch) => {
    try {
      dispatch(startLoading('adminPanelAction'))
      const result = await contractInstance.becomeShopOwner({ from: account })
      if (result.receipt) {
        displaySuccess('You successfuly made youself a shop owner')
        dispatch(getUserStatus({ contractInstance, account }))
        browserHistory.push('/shopowner')
      } else {
        displayError('There was an error making you a shop owner. Check response in console log')
        console.log('RESPONSE FROM MAKING MYSELF SHOP OWNER', result)
      }
      dispatch(finishLoading('adminPanelAction'))
    } catch (e) {
      displayError(e.message)
      dispatch(clearAllLoading())
      console.log('ERROR MAKING MYSELF A SHOP OWNER', e)
    }
  }
}

export function makeMyselfRegularUser({ contractInstance, account }) {
  return async (dispatch) => {
    try {
      dispatch(startLoading('adminPanelAction'))
      const result = await contractInstance.becomeRegularUser({ from: account })
      if (result.receipt) {
        displaySuccess('You successfuly made youself a regular user/shopper')
        dispatch(getUserStatus({ contractInstance, account }))
      } else {
        displayError('There was an error making you a shop owner. Check response in console log')
        console.log('response from making myself a regular user', result)
      }
      dispatch(finishLoading('adminPanelAction'))
    } catch (e) {
      displayError(e.message)
      dispatch(clearAllLoading())
      console.log('error from making myself a regular user', e)
    }
  }
}