import { INITIALIZE_CONTRACT } from './constants'

export const initializeContract = ({ contractInstance, web3 }) => {
  return (dispatch) => {
    console.log('GETTING HEREREE', web3)
    dispatch({
      type: INITIALIZE_CONTRACT,
      payload: {
        web3,
        contractInstance
      }
    })
  }
}