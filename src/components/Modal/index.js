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

DefaultModal.propTypes = {
  active: PropTypes.bool.isRequired,
  header: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired
}

export default DefaultModal