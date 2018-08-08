import React, { Component } from 'react'
import { formValueSelector } from 'redux-form'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Spin from 'antd/lib/spin'
import List from 'antd/lib/list'
import Button from 'antd/lib/button'
import PropTypes from 'prop-types'
import { displayError } from '../../util/displayMessage'
import MarketplaceContract from '../../contracts/KulaksMarketplace.json'
import getWeb3 from '../../util/getWeb3'
import instantiateContract from '../../util/instantiateContract'

// actions
import {
  makeAdmin,
  getAllUsers,
  makeShopOwner,
  makeUser,
  makeMyselfAdmin,
  makeMyselfShopOwner,
  makeMyselfRegularUser,
  getUserStatus
} from '../../redux/user/actions'

// components
import Layout from '../../components/Layout'
import AdminTestPanel from '../../components/AdminTestPanel'
import AddAccount from '../../components/AddAccount'

// styles
import { StyledContainer, StyledAvatar } from './styles'

const selector = formValueSelector('addAccount')

class AdminPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      contractInstance: null,
      account: null,
      quantity: 1,
    }
  }

  componentWillMount = async () => {
    try {
      const { web3, contractInstance, account } = await instantiateContract({
        getWeb3,
        contractJson: MarketplaceContract
      })
      this.setState({
        ...this.state,
        web3,
        contractInstance,
        account

      })

      const { actions } = this.props
      actions.getAllUsers({ contractInstance, account })
      actions.getUserStatus({ contractInstance, account })
    } catch (e) {
      displayError('Error finding web3 or instatiating the contract.', e.message)
      console.log('Error finding web3 or instatiating the contract.', e.message)
    }
  }

  render() {
    const { contractInstance, account } = this.state
    const { actions, adminList, loading, accountAddress, userStatus } = this.props
    return (
      <Layout>
        <StyledContainer>
          <AdminTestPanel
            userStatus={userStatus}
            loading={loading.adminPanelAction}
            makeMyselfAdmin={() => (actions.makeMyselfAdmin({ contractInstance, account }))}
            makeMyselfShopOwner={() => (actions.makeMyselfShopOwner({ contractInstance, account }))}
            makeMyselfUser={() => (actions.makeMyselfRegularUser({ contractInstance, account }))}
          />
          <AddAccount
            adminList={adminList}
            loading={loading.adminListAction}
            accountAddress={accountAddress}
            makeAdmin={() => (actions.makeAdmin({ contractInstance, account, userAccount: accountAddress }))}
            makeShopOwner={() => (actions.makeShopOwner({ contractInstance, account, userAccount: accountAddress }))}
            makeUser={() => (actions.makeUser({ contractInstance, account, userAccount: accountAddress }))}
          />
          <Spin tip="Submitting..." spinning={loading.adminListAction}>
            <List
              size="large"
              header={<h3>List of Registered Accounts</h3>}
              bordered
              dataSource={adminList}
              renderItem={(x) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<StyledAvatar size="large" status={x.status}>{x.status}</StyledAvatar>}
                    title={`Acct: ${x.account}`}
                    description={`Status: ${x.status}`}
                  />
                  <Button disabled={x.status === 'admin'} onClick={() => (actions.makeAdmin({ contractInstance, account, userAccount: x.account }))}>Make Admin</Button>
                  <Button disabled={x.status === 'owner'} onClick={() => (actions.makeShopOwner({ contractInstance, account, userAccount: x.account }))}>Make Shop Owner</Button>
                  <Button disabled={x.status === 'user'} onClick={() => (actions.makeUser({ contractInstance, account, userAccount: x.account }))}>Make User</Button>
                </List.Item>
                )}
            />
          </Spin>
        </StyledContainer>
      </Layout>
    )
  }
}

AdminPage.defaultProps = {
  accountAddress: undefined // not my favorite thing to do but this is default value provided by redux-form - AK
}

AdminPage.propTypes = {
  loading: PropTypes.object.isRequired,
  adminList: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  accountAddress: PropTypes.string,
  userStatus: PropTypes.string.isRequired
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    makeAdmin,
    getAllUsers,
    makeShopOwner,
    makeUser,
    makeMyselfAdmin,
    makeMyselfShopOwner,
    makeMyselfRegularUser,
    getUserStatus
  }, dispatch),
})

const mapStateToProps = (state) => ({
  user: state.user.data,
  adminList: state.user.adminList,
  userStatus: state.user.userStatus,
  accountAddress: selector(state, 'address'),
  loading: state.loading,
})

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage)