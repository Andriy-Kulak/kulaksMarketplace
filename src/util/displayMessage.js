import message from 'antd/lib/message'

message.config({
  top: 50,
  duration: 7,
  maxCount: 3,
})

// pop up that display error message with the help of ant design
export const displayError = (e) => (message.error(`There was an error processing your request. More info: ${e.message}`))

export const displaySuccess = (text) => (message.success(text))