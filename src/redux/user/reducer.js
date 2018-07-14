import { UPDATE_USER_BALANCE, USER_LOGGED_IN, USER_LOGGED_OUT } from './constants'

const initialState = {
  usrAcctBalance: null,
  data: null
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER_BALANCE:
      return Object.assign({}, state, {
        usrAcctBalance: action.payload
      })
    case USER_LOGGED_IN:
      return Object.assign({}, state, {
        data: action.payload
      })
    case USER_LOGGED_OUT:
      return Object.assign({}, state, {
        data: action.payload
      })
    default:
      return state
  }
}

export default userReducer
