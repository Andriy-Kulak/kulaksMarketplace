import { LOADING_MODAL, HIDE_MODAL } from './constants'

export const loadingModal = () => {
  return (dispatch) => {
    dispatch({
      type: LOADING_MODAL,
      payload: {
        active: true,
        header: 'Loading. ',
        body: 'Please wait.'
      }
    })
  }
}

export const hideModal = () => {
  return (dispatch) => {
    dispatch({
      type: HIDE_MODAL,
      payload: {
        active: false,
        header: null,
        body: null
      }
    })
  }
}