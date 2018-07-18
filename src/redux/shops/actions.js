import { CREATE_SHOP, GET_ALL_OWNER_STORES } from './constants'

function storeCreated(result) {
  return ({
    type: CREATE_SHOP,
    payload: result
  })
}

export function createShop({ contractInstance, name, type, description, account }) {
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

export function getAllShopsByOwner({ contractInstance, account }) {
  return async (dispatch) => {
    // checking if shopOwner has created stores
    const response = await contractInstance.doesOwnerHaveShops.call({ from: account })
    console.log('RESPOND FROM GET ALL STORES ====>', response)
    if (response[0] === false) {
      return dispatch({
        type: GET_ALL_OWNER_STORES,
        payload: [] // owner does not have any stores so return back an empty array
      })
    }
    const lengthOfArray = response[1].c[0]
    console.log('reponse[1].c[0] lengthOfArray', lengthOfArray)

    if (response[0] === true && response[1] && response[1].c[0]) {
      let counter = 0
      const shopsArray = []
      const getStoreIdsArray = []
      const getStoreInfoArray = []

      while (counter < lengthOfArray) {
        getStoreIdsArray.push(contractInstance.getShopIdByOrder(counter))
        console.log('counter ----', counter)
        counter += 1
      }

      const storeIdResp = await Promise.all(getStoreIdsArray)
      console.log('storeIdResp ==>', storeIdResp)
      console.log('getStoreIdsArray ==>', getStoreIdsArray)
      storeIdResp.forEach((x) => {
        console.log('ARE WE GETTING HEREEEE', x)
        if (x[0] === true && x[1].c[0]) {
          const storeId = x[1].c[0]
          getStoreInfoArray.push(contractInstance.getShopInfo(storeId, { from: account }))
        }
      })
      console.log('getStoreInfoArray ==>', getStoreInfoArray)
      const storeInfoResp = await Promise.all(getStoreInfoArray)
      console.log('storeInfoResp ==>', storeInfoResp)
      storeInfoResp.forEach((x) => {
        shopsArray.push({
          id: x[0].c[0],
          name: x[1],
          type: x[2],
          description: x[3],
          owner: x[4],
        })
      })
      return dispatch({
        type: GET_ALL_OWNER_STORES,
        payload: shopsArray
      })
    }
  }
}