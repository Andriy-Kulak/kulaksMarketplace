import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import Button from 'antd/lib/button'
import { AntdInput } from '../Fields'


// styles
import {
  StyledFormContainer,
  StyledNumberField
} from './styles'

const CreateProduct = ({ handleSubmit }) => {
  return (
    <StyledFormContainer>
      <h3>Create Product</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">
            Product Name
            <Field name="name" component={AntdInput} type="text" hasFeedback />
          </label>
        </div>
        <div>
          <label htmlFor="description">
            Description
            <Field name="description" id="description" component={AntdInput} type="text" xs hasFeedback />
          </label>
        </div>
        <div>
          <label htmlFor="price">
            Price (in Wei)
            <StyledNumberField name="price" id="price" component={AntdInput} type="number" hasFeedback />
          </label>
        </div>
        <Button type="primary" htmlType="submit">Submit</Button>
      </form>
    </StyledFormContainer>)
}

CreateProduct.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

const validate = (values) => {
  const errors = {}
  if (!values.name) { errors.name = 'Required!' }
  if (!values.description) { errors.description = 'Required!' }
  if (!values.price) { errors.price = 'Required!' }

  return errors
}

const CreateProductWithForm = reduxForm({
  // a unique name for the form
  form: 'newProduct',
  validate
})(CreateProduct)

export default CreateProductWithForm