import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import userReducer from './user/reducer'
import shopReducer from './shops/reducer'

const reducer = combineReducers({
  routing: routerReducer,
  shop: shopReducer,
  user: userReducer
})

export default reducer
