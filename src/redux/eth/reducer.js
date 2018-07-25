import { INITIALIZE_CONTRACT, CLEAR_CONTRACT } from './constants'

const initialState = {
  web3: null,
  contractInstance: null
}

const ethReducer = (state = initialState, action) => {
  switch (action.type) {
    case INITIALIZE_CONTRACT: {
      const { web3, contractInstance } = action.payload
      return Object.assign({}, state, {
        web3,
        contractInstance
      })
    }
    case CLEAR_CONTRACT: {
      return Object.assign({}, state, {
        web3: null,
        contractInstance: null
      })
    }
    default:
      return state
  }
}

export default ethReducer
