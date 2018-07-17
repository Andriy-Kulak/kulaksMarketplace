import { CREATE_SHOP } from './constants'

function storeCreated(result) {
  return ({
    type: CREATE_SHOP,
    payload: result
  })
}

export function createStore({ contractInstance, name, type, description, account }) {
  return (dispatch) => {
    contractInstance.createStore(name, type, description, { from: account, gas: 550000 }).then((result) => {
      console.log('CREATED STORE RESULT =========', result)
      dispatch(storeCreated(result))
    }).catch((e) => {
      console.log('ERROR', e)
      console.log('ERROR message', e.message)
    })
  }
}