import styled from 'styled-components'
import Card from 'antd/lib/card'

export const StyledContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`

export const StyledProduct = styled(Card)`
  margin: 5px !important;
  .ant-card-body{
    background: white !important;
  } 
`


export const StyledNoProductsWarn = styled.h4`
  background-color: yellow;
  width: 400px;
`

export const StyledProductList = styled(Card)`
  /* .ant-card-body{
    background: #e6f2ff !important;
  } */
`