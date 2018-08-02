import styled from 'styled-components'
import { Field } from 'redux-form'
import Card from 'antd/lib/card'

export const StyledFormContainer = styled(Card)`
  margin: 15px !important;
  max-width: 400px !important;
`
export const StyledNumberField = styled(Field)`
  width: 150px !important;
`