import { CREATE_SHOP } from './constants'

const initialState = {
  storeTest: null,
}

const shopReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SHOP:
      return Object.assign({}, state, {
        userAcctBalance: action.payload
      })
    default:
      return state
  }
}

export default shopReducer
