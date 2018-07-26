import Card from 'antd/lib/card'
import styled from 'styled-components'

export const StyledPanel = styled(Card)`
 /* width: 100%; */
 max-width: 620px;
`

export const StyledContainer = styled.div`
 display: flex;
 justify-content: flex-start;

 > div {
   padding-right: 10px;
 }
`