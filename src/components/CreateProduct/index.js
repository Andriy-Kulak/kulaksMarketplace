import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'

const CreateProduct = ({ handleSubmit }) => {
  return (
    <div style={{ border: '1px solid black' }}>
      <h3>Create Store</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">
            Product Name
            <Field name="name" component="input" type="text" required />
          </label>
        </div>
        <div>
          <label htmlFor="description">
            Description
            <Field name="description" id="description" component="input" type="text" required />
          </label>
        </div>
        <div>
          <label htmlFor="price">
            Price (in Wei)
            <Field name="price" id="price" component="input" type="number" required />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>)
}

CreateProduct.propTypes = {
  handleSubmit: PropTypes.func.isRequired
}

const CreateProductWithForm = reduxForm({
  // a unique name for the form
  form: 'newProduct'
})(CreateProduct)

export default CreateProductWithForm