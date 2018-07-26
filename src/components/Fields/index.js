// got inspired from this example: https://codesandbox.io/s/JZYL70WpK

import React from 'react'
import Form from 'antd/lib/form'
import Input from 'antd/lib/input'

// to be used if we want to have inputs/labels have custom sizing on certain screen sizes
// const formItemLayout = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 6 }
//   },
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 14 }
//   }
// }

const FormItem = Form.Item

const makeField = (Component) => ({ input, meta, children, hasFeedback, label, ...rest }) => { // eslint-disable-line
  const hasError = meta.touched && meta.invalid
  return (
    <FormItem
      // {...formItemLayout}
      label={label}
      validateStatus={hasError ? 'error' : 'success'}
      hasFeedback={hasFeedback && hasError}
      help={hasError && meta.error}
    >
      <Component {...input} {...rest}>
        {children}
      </Component>
    </FormItem>
  )
}

const { TextArea } = Input

export const AntdInput = makeField(Input)
export const AntdTextArea = makeField(TextArea)