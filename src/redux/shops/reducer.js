import {
  CREATE_SHOP,
  GET_ALL_OWNER_STORES,
  CREATE_PRODUCT,
  GET_PRODUCTS_BY_SHOP,
  SELECTED_PRODUCT,
  CLEAR_EXISTING_PRODUCT,
  CHECK_SHOP_BALANCE,
  GET_ALL_USER_SHOPS,
  GET_SHOP_DETAILS
} from './constants'

const initialState = {
  storeTest: null,
  owner: [],
  all: [],
  products: {},
  selectedProduct: {},
  shopBalances: {},
  userShops: [],
  shopDetails: {}
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
    case GET_ALL_USER_SHOPS:
      return Object.assign({}, state, {
        userShops: action.payload
      })
    case GET_PRODUCTS_BY_SHOP: {
      return Object.assign({}, state, {
        products: {
          ...state.products, // keep the products retrieved for other stores
          ...action.payload // add/updated products retrieved for selected store
        }
      })
    }
    case GET_SHOP_DETAILS:
      return Object.assign({}, state, {
        shopDetails: action.payload
      })
    case SELECTED_PRODUCT:
      return Object.assign({}, state, {
        selectedProduct: action.payload
      })
    case CLEAR_EXISTING_PRODUCT:
      return Object.assign({}, state, {
        selectedProduct: {}
      })
    case CHECK_SHOP_BALANCE:
      return Object.assign({}, state, {
        shopBalances: {
          ...state.shopBalances, // keep the products retrieved for other stores
          ...action.payload // add/updated products retrieved for selected store
        }
      })
    default:
      return state
  }
}

export default shopReducer
