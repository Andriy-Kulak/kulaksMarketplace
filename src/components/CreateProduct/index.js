import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import Button from 'antd/lib/button'
import { AntdInput, AntdTextArea } from '../Fields'
// import Card from 'ant/lib/card'


// styles
import {
  StyledFormContainer,
  StyledNumberField
} from './styles'

const CreateProduct = ({ handleSubmit, loading }) => {
  return (
    <StyledFormContainer title="Create New Product">
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
            <Field name="description" id="description" component={AntdTextArea} type="text" hasFeedback />
          </label>
        </div>
        <div>
          <label htmlFor="price">
            Price (in Wei)
            <StyledNumberField name="price" id="price" component={AntdInput} type="number" hasFeedback />
          </label>
        </div>
        <Button type="primary" loading={loading} htmlType="submit">{loading ? 'Submitting...' : 'Submit'}</Button>
      </form>
    </StyledFormContainer>)
}

CreateProduct.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired // loading bool specific to new product
}

const validate = (values) => {
  const errors = {}
  if (!values.name) { errors.name = 'Required!' }
  if (!values.description) { errors.description = 'Required!' }
  if (!values.price) { errors.price = 'Required!' }
  if (!(values.price > 1000)) { errors.price = 'Minimum price for a product is 1,000 wei!' }

  return errors
}

const CreateProductWithForm = reduxForm({
  // a unique name for the form
  form: 'newProduct',
  validate
})(CreateProduct)

export default CreateProductWithForm