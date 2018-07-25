import { LOADING_MODAL, HIDE_MODAL } from './constants'

const initialState = {
  active: false,
  header: null,
  body: null
}

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_MODAL: {
      const { active, header, body } = action.payload
      return Object.assign({}, state, {
        active,
        header,
        body,
      })
    }
    case HIDE_MODAL:
      return Object.assign({}, state, {
        active: false,
        header: null,
        body: null,
      })
    default:
      return state
  }
}

export default modalReducer
