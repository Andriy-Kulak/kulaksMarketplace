import React from 'react'
import PropTypes from 'prop-types'
import Layout from '../../components/Layout'

const Dashboard = ({ authData }) => {
  return (
    <Layout>
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Dashboard</h1>
            <p><strong>Congratulations {authData.name}!</strong> from {authData.country} If you are seeing this page, you have logged in with UPort successfully.</p>
          </div>
        </div>
      </main>
    </Layout>
  )
}

Dashboard.propTypes = {
  authData: PropTypes.object.isRequired
}

export default Dashboard
