import React from 'react'
import Button from 'antd/lib/button'
import PropTypes from 'prop-types'
import Spin from 'antd/lib/spin'

// styles
import { StyledPanel, StyledContainer } from './styles'

const AdminTestPanel = ({ makeMyselfAdmin, makeMyselfShopOwner, makeMyselfUser, loading, userStatus }) => {
  return (
    
    <StyledPanel title="Admin Test Panel">
      <Spin tip="Submitting..." spinning={loading}>
        <div>
          <h4>Your Current Status: {userStatus} </h4>
        </div>
        <StyledContainer>
          <div>
            <Button
              onClick={() => (makeMyselfAdmin())}
              disabled={userStatus === 'admin'}
            >Make Myself Admin
            </Button>
          </div>
          <div>
            <Button
              onClick={() => (makeMyselfShopOwner())}
              disabled={userStatus === 'owner'}
            >Make Myself Shop Owner
            </Button>
          </div>
          <div>
            <Button
              onClick={() => (makeMyselfUser())}
              disabled={userStatus === 'shopper'}
            >Make Myself Regular User
            </Button>
          </div>
        </StyledContainer>
      </Spin>
    </StyledPanel>
  )
}

AdminTestPanel.propTypes = {
  makeMyselfAdmin: PropTypes.func.isRequired,
  makeMyselfShopOwner: PropTypes.func.isRequired,
  makeMyselfUser: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  userStatus: PropTypes.string.isRequired
}

export default AdminTestPanel