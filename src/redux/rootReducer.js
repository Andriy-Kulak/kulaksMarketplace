import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import userReducer from './user/reducer'
import shopReducer from './shops/reducer'
import modalReducer from './modal/reducer'

const reducer = combineReducers({
  routing: routerReducer,
  shop: shopReducer,
  user: userReducer,
  modal: modalReducer
})

export default reducer
