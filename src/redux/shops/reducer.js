import { CREATE_SHOP, GET_ALL_OWNER_STORES } from './constants'

const initialState = {
  storeTest: null,
  owner: [],
  all: []
}

const shopReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SHOP:
      return Object.assign({}, state, {
        storeTest: action.payload
      })
    case GET_ALL_OWNER_STORES:
      return Object.assign({}, state, {
        owner: action.payload
      })
    default:
      return state
  }
}

export default shopReducer
