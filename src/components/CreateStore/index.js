import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import Button from 'antd/lib/button'
import { AntdInput, AntdTextArea } from '../Fields'

import { StyledFormContainer } from './styles'

const CreateStore = ({ handleSubmit, loading }) => {
  return (
    <StyledFormContainer>
      <h3>Create Shop</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">
            Store Name
            <Field name="name" component={AntdInput} type="text" hasFeedback />
          </label>
        </div>
        <div>
          <label htmlFor="type">
            Store Type
            <Field name="type" component={AntdInput} type="text" hasFeedback />
          </label>
        </div>
        <div>
          <label htmlFor="description">
            Description
            <Field name="description" id="description" component={AntdTextArea} type="text" hasFeedback />
          </label>
        </div>
        <Button type="primary" loading={loading} htmlType="submit">{loading ? 'Submitting...' : 'Submit'}</Button>
      </form>
    </StyledFormContainer>)
}

CreateStore.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired // loading boolean specific to new Shop execution
}

const validate = (values) => {
  const errors = {}
  if (!values.name) { errors.name = 'Required!' }
  if (!values.type) { errors.type = 'Required!' }
  if (!values.description) { errors.description = 'Required!' }

  return errors
}

const CreateStoreWithForm = reduxForm({
  form: 'newShop',
  validate
})(CreateStore)

export default CreateStoreWithForm