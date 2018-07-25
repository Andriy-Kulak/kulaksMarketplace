import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { UserIsAuthenticated } from './util/wrappers'

// Layouts
import Dashboard from './containers/Dashboard'
import Home from './containers/Home'
import ShopOwner from './containers/ShopOwner'
import ProductPage from './containers/ProductPage'
import Profile from './components/User/layouts/profile/Profile'

// Redux Store
import store from './redux/store'

const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render((
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={UserIsAuthenticated(Dashboard)} />
      <Route path="/profile" component={UserIsAuthenticated(Profile)} />
      <Route path="shop/:shopId/product/:productId" component={ProductPage} />
      <Route path="/shopowner" component={ShopOwner} />
    </Router>
  </Provider>
),
document.getElementById('root')
)
