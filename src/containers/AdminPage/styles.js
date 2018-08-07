import styled from 'styled-components'
import Avatar from 'antd/lib/avatar'

export const StyledContainer = styled.div`
  margin-top: 15px;
`

export const StyledAvatar = styled(Avatar)`
  background-color: ${(props) => (props.status === 'owner' ? 'green !important' : '')};
  background-color: ${(props) => (props.status === 'admin' ? 'blue !important' : '')};
  background-color: ${(props) => (props.status === 'user' ? 'orange !important' : '')};
`