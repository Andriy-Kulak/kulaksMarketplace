import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'

const CreateStore = ({ handleSubmit, doShopsExist }) => {
  return (
    <div style={{ border: '1px solid black' }}>
      {!doShopsExist && <h4>You do not have any existing shop. Create a new one below!</h4>}
      <h3>Create Shop</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">
            Store Name
            <Field name="name" component="input" type="text" required />
          </label>
        </div>
        <div>
          <label htmlFor="type">
            Store Type
            <Field name="type" component="input" type="text" required />
          </label>
        </div>
        <div>
          <label htmlFor="description">
            Description
            <Field name="description" id="description" component="input" type="text" required />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>)
}

CreateStore.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  doShopsExist: PropTypes.bool.isRequired
}

const CreateStoreWithForm = reduxForm({
  // a unique name for the form
  form: 'newShop'
})(CreateStore)

export default CreateStoreWithForm