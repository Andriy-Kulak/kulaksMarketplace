import { CREATE_SHOP, GET_ALL_OWNER_STORES } from './constants'

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

export function getAllStoresByOwner({ contractInstance, account }) {
  return async (dispatch) => {
    const response = await contractInstance.doesOwnerHaveStores.call({ from: account })
    console.log('RESPOND FROM GET ALL STORES ====>', response)
    if (response[0] === false) {
      dispatch({
        type: GET_ALL_OWNER_STORES,
        payload: [] // owner does not have any stores so return back an empty array
      })
    }
    const lengthOfArray = response[1].c[0]
    console.log('reponse[1].c[0]', lengthOfArray)

    // Promise.all([contractInstance.getStoreInfo.call(1), contractInstance.getStoreInfo.call(4)]).then((result) => {
    //   console.log('Promise result TEST 23423423', result)
    // })

    if (response[0] === true && response[1] && response[1].c[0]) {
      let counter = 0
      const storesArray = []

      while (counter < lengthOfArray) {
        contractInstance.getStoreIdByOrder.call(counter).then((storeIdResp) => {
          console.log('1111 storeIdResponse =====>', storeIdResp)

          if (storeIdResp[0] === true && storeIdResp[1].c[0]) {
            const storeId = storeIdResp[1].c[0]
            console.log('222 storeIdResp[1].c[0]', storeIdResp[1].c[0])
            contractInstance.getStoreInfo.call(storeId).then((storeInfoResp) => {
              console.log('33333', storeInfoResp)
              storesArray.push({
                id: storeId,
                name: storeInfoResp[0],
                type: storeInfoResp[1],
                description: storeInfoResp[2],
                owner: storeInfoResp[3],
              })
            })
          }
        })
        console.log('444 counter ----', counter)
        counter += 1
      }
      console.log('GETTING wedfwdfwdfsdfsdfsdfsdfsdfsdfsdf', storesArray)
      return dispatch({
        type: GET_ALL_OWNER_STORES,
        payload: storesArray
      })
    }
  }
}