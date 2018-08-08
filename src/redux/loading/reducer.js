import { START_LOADING, FINISH_LOADING, CLEAR_ALL_LOADING } from './constants'

const initialState = {
  newShop: false,
  newProduct: false,
  purchaseProduct: false,
  withdraw: false,
  adminListAction: false,
  adminPanelAction: false
}

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case START_LOADING: {
      return Object.assign({}, state, {
        ...action.payload
      })
    }
    case FINISH_LOADING:
      return Object.assign({}, state, {
        ...action.payload
      })
    case CLEAR_ALL_LOADING:
      return initialState
    default:
      return state
  }
}

export default loadingReducer