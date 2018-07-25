import React from 'react'
import Modal from 'antd/lib/modal'
import PropTypes from 'prop-types'

const DefaultModal = ({ active, header, body }) => {
  return (
    <Modal
      visible={active}
      closable={false}
      okText={null}
      title={header}
      // onOk={this.handleOkModal}
      // onCancel={this.handleCancelModal}
    >
      <p>{body}</p>
    </Modal>
  )
}

DefaultModal.defaultProps = {
  header: null,
  body: null
}

DefaultModal.propTypes = {
  active: PropTypes.bool.isRequired,
  header: PropTypes.string,
  body: PropTypes.string
}

export default DefaultModal