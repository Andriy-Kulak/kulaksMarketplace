import { CREATE_SHOP, GET_ALL_OWNER_STORES, CREATE_PRODUCT, GET_PRODUCTS_BY_SHOP } from './constants'

const initialState = {
  storeTest: null,
  owner: [],
  all: [],
  products: {}
}

const shopReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_SHOP:
      return Object.assign({}, state, {
        storeTest: action.payload
      })
    case CREATE_PRODUCT: {
      return Object.assign({}, state, {
        productTest: action.payload
      })
    }
    case GET_ALL_OWNER_STORES:
      return Object.assign({}, state, {
        owner: action.payload
      })
    case GET_PRODUCTS_BY_SHOP: {
      return Object.assign({}, state, {
        products: {
          ...state.products, // keep the products retrieved for other stores
          ...action.payload // add/updated products retrieved for selected store
        }
      })
    }
    default:
      return state
  }
}

export default shopReducer
