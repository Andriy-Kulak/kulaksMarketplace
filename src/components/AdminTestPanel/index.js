import React from 'react'
import Button from 'antd/lib/button'
import PropTypes from 'prop-types'

// styles
import { StyledPanel, StyledContainer } from './styles'

const AdminTestPanel = ({ makeMyselfAdmin, makeMyselfShopOwner, makeMyselfUser }) => {
  return (
    <StyledPanel title="Admin Test Panel">
      <div>
        <h4>Your Current Status: </h4>
      </div>
      <StyledContainer>
        <div>
          <Button onClick={() => (makeMyselfAdmin())}>Make Myself Admin</Button>
        </div>
        <div>
          <Button onClick={() => (makeMyselfShopOwner())}>Make Myself Shop Owner</Button>
        </div>
        <div>
          <Button onClick={() => (makeMyselfUser())}>Make Myself Regular User</Button>
        </div>
      </StyledContainer>
    </StyledPanel>
  )
}

AdminTestPanel.propTypes = {
  makeMyselfAdmin: PropTypes.func.isRequired,
  makeMyselfShopOwner: PropTypes.func.isRequired,
  makeMyselfUser: PropTypes.func.isRequired
}

export default AdminTestPanel