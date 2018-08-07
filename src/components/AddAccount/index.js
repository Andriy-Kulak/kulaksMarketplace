import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'
import Spin from 'antd/lib/spin'
import Button from 'antd/lib/button'
import Card from 'antd/lib/card'
import { AntdInput } from '../Fields'
import { displayError } from '../../util/displayMessage'

import { StyledDivider, StyledLeft, StyledRight } from './styles'

const AddAccount = ({handleSubmit, accountAddress, makeAdmin, makeShopOwner, makeUser, loading }) => {
  console.log('PROPS ==============>', accountAddress)

  // ensuring admin properly fills our address before executing function
  const checkAddress = (address, func) => {
    if (!address) {
      return displayError('Please provide a valid address before submitting.')
    } else if (address.length !== 42) {
      return displayError('Address should be 42 characters long. Please include 0x in the beginning as well.')
    }
    return func()
  }

  return (
    <Card title="Admin Page">
      <Spin tip="Submitting..." spinning={loading}>
        <form onSubmit={handleSubmit}>
          <StyledDivider>
            <StyledLeft>
              <label htmlFor="name">
                Add Account Address
                <Field name="address" component={AntdInput} type="text" hasFeedback />
              </label>
            </StyledLeft>
            <StyledRight>
              {/* <Button type="primary" loading={loading} htmlType="submit">{loading ? 'Submitting...' : 'Submit'}</Button> */}
              <Button onClick={() => (checkAddress(accountAddress, makeAdmin))}>Make Admin</Button>
              <Button onClick={() => (checkAddress(accountAddress, makeShopOwner))}>Make Shop Owner</Button>
              <Button onClick={() => (checkAddress(accountAddress, makeUser))}>Make User</Button>
            </StyledRight>
          </StyledDivider>
        </form>
      </Spin>
    </Card>
  )
}

AddAccount.defaultProps = {
  accountAddress: undefined // not my favorite thing to do but this is default value provided by redux-form - AK
}

AddAccount.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  accountAddress: PropTypes.string,
  makeAdmin: PropTypes.func.isRequired,
  makeShopOwner: PropTypes.func.isRequired,
  makeUser: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired // loading boolean specific to new Shop execution
}

const validate = (values) => {
  const errors = {}
  if (!values.address) { errors.address = 'Required!' }
  return errors
}

const AddAccountWithForm = reduxForm({
  form: 'addAccount',
  validate
})(AddAccount)

export default AddAccountWithForm