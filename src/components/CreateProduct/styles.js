import styled from 'styled-components'
import { Field } from 'redux-form'

export const StyledFormContainer = styled.div`
  border: 1px solid black;
  padding: 15px;
  max-width: 400px;
`
export const StyledNumberField = styled(Field)`
  width: 150px !important;
`