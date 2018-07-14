import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import userReducer from './../components/User/userReducer'
import homeReducer from './home/reducer'

const reducer = combineReducers({
  routing: routerReducer,
  user: userReducer,
  home: homeReducer
})

export default reducer
