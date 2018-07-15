import { CREATE_SHOP } from './constants'

function storeCreated(result) {
  return ({
    type: CREATE_SHOP,
    payload: result
  })
}

export function createStore({ contractInstance, name, type, description, address }) {
  return (dispatch) => {
    contractInstance.createStore(name, type, description, { from: address }).then((result) => {
      console.log('CREATED STORE RESULT =========', )
      dispatch(storeCreated(result))
    })
  }
}