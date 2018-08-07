import { UPDATE_USER_BALANCE, USER_LOGGED_IN, USER_LOGGED_OUT, UPDATE_ADMIN_LIST } from './constants'

const initialState = {
  userAcctBalance: null,
  data: null,
  adminList: []
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER_BALANCE:
      return Object.assign({}, state, {
        userAcctBalance: action.payload
      })
    case USER_LOGGED_IN:
      return Object.assign({}, state, {
        data: action.payload
      })
    case USER_LOGGED_OUT:
      return Object.assign({}, state, {
        data: action.payload
      })
    case UPDATE_ADMIN_LIST:
      return Object.assign({}, state, {
        adminList: action.payload
      })
    default:
      return state
  }
}

export default userReducer
