import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { UserIsAuthenticated } from './util/wrappers'

// Layouts
import Dashboard from './containers/Dashboard'
import HomePage from './containers/HomePage'
import ShopOwnerPage from './containers/ShopOwnerPage'
import ProductPage from './containers/ProductPage'
import Profile from './components/User/layouts/profile/Profile'
import AdminPage from './containers/AdminPage'
import ShopUserPage from './containers/ShopUserPage'

// Redux Store
import store from './redux/store'

const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={HomePage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/dashboard" component={UserIsAuthenticated(Dashboard)} />
      <Route path="/profile" component={UserIsAuthenticated(Profile)} />
      <Route path="shop/:shopId" component={ShopUserPage} />
      <Route path="shop/:shopId/product/:productId" component={ProductPage} />
      <Route path="/shopowner" component={ShopOwnerPage} />
    </Router>
  </Provider>
),
document.getElementById('root')
)
