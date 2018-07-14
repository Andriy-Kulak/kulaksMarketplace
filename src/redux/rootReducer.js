import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import userReducer from './user/reducer'

const reducer = combineReducers({
  routing: routerReducer,
  // user: userReducer,
  user: userReducer
})

export default reducer
