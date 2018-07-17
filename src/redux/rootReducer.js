import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import userReducer from './user/reducer'
import shopReducer from './shops/reducer'
import modalReducer from './modal/reducer'
import ethReducer from './eth/reducer'

const reducer = combineReducers({
  routing: routerReducer,
  shops: shopReducer,
  user: userReducer,
  modal: modalReducer,
  eth: ethReducer,
  form: formReducer
})

export default reducer
