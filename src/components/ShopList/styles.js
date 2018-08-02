import styled from 'styled-components'
import Tabs from 'antd/lib/tabs'
import Card from 'antd/lib/card'

export const StyledContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`

export const StyledTabs = styled(Tabs)`
  width: 100%;
`

export const StyledNoShopsWarn = styled.h4`
  background-color: yellow;
  width: 400px;
`

export const StyledShopContainer = styled.div`
  display: flex;
`

export const StyledShopDetails = styled(Card)`
  margin: 0px 25px 0px 5px !important;
`