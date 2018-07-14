import { UPDATE_USER_BALANCE } from './constants'

const initialState = {
  usrAcctBalance: null
}

const homeReducer = (state = initialState, action) => {
  console.log('reduccerer', action)
  if (action.type === UPDATE_USER_BALANCE) {
    return Object.assign({}, state, {
      usrAcctBalance: action.payload
    })
  }

  return state
}

export default homeReducer
