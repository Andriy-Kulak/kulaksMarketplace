import { START_LOADING, FINISH_LOADING, CLEAR_ALL_LOADING } from './constants'

export const startLoading = (executionType) => {
  return (dispatch) => {
    dispatch({
      type: START_LOADING,
      payload: {
        [executionType]: true,
      }
    })
  }
}

export const finishLoading = (executionType) => {
  return (dispatch) => {
    dispatch({
      type: FINISH_LOADING,
      payload: {
        [executionType]: false,
      }
    })
  }
}

export const clearAllLoading = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_ALL_LOADING
    })
  }
}

