import { reset } from 'redux-form'
import { CREATE_SHOP, GET_ALL_OWNER_STORES } from './constants'

export function getAllShopsByOwner({ contractInstance, account }) {
  const start = Date.now()
  return async (dispatch) => {
    // checking if shopOwner has created stores
    const response = await contractInstance.doesOwnerHaveShops({ from: account })
    console.log('RESPOND FROM GET ALL STORES ====>', response)
    if (response[0] === false) {
      return dispatch({
        type: GET_ALL_OWNER_STORES,
        payload: [] // owner does not have any stores so return back an empty array
      })
    }
    const lengthOfArray = response[1].c[0]
    console.log('reponse[1].c[0] lengthOfArray', lengthOfArray)
    const shopRespConfirm = ({ id, name, type, description }) => {
      return (typeof id === 'number' && typeof name === 'string' && typeof type === 'string' && typeof description === 'string')
    }

    if (response[0] === true && response[1] && response[1].c[0]) {
      let counter = 0
      const shopsArray = []
      const getShopIdsArray = []
      const getShopInfoArray = []

      while (counter < lengthOfArray) {
        getShopIdsArray.push(contractInstance.getShopIdByOrder(counter))
        console.log('counter ----', counter)
        counter += 1
      }

      const storeIdResp = await Promise.all(getShopIdsArray)
      console.log('storeIdResp ==>', storeIdResp)
      console.log('getStoreIdsArray ==>', getShopIdsArray)
      storeIdResp.forEach((x) => {
        console.log('ARE WE GETTING HEREEEE', x)
        if (x[0] === true && x[1].c[0]) {
          const storeId = x[1].c[0]
          getShopInfoArray.push(contractInstance.getShopInfo(storeId, { from: account }))
        }
      })
      console.log('getStoreInfoArray ==>', getShopInfoArray)
      const storeInfoResp = await Promise.all(getShopInfoArray)
      console.log('storeInfoResp ==>', storeInfoResp)
      storeInfoResp.forEach((x) => {
        const id = x[0].c[0]
        const name = x[1]
        const type = x[2]
        const description = x[3]
        const owner = x[4]
        if (shopRespConfirm({ id, name, type, description })) {
          shopsArray.push({ id, name, type, description, owner })
        }
      })
      console.log('time it took to get all stores', Date.now() - start)
      return dispatch({
        type: GET_ALL_OWNER_STORES,
        payload: shopsArray
      })
    }
  }
}

function shopCreated(result) {
  return ({
    type: CREATE_SHOP,
    payload: result
  })
}

export function createShop({ contractInstance, name, type, description, account }) {
  return (dispatch) => {
    contractInstance.createStore(name, type, description, { from: account, gas: 550000 }).then((result) => {
      console.log('CREATED STORE RESULT =========', result)
      dispatch(shopCreated(result))
      dispatch(reset('newStore')) // clear fields from newStore form

      // trigger methods so you get the latest list of shops
      dispatch(getAllShopsByOwner({ contractInstance, account }))
    }).catch((e) => {
      console.log('ERROR', e)
      console.log('ERROR message', e.message)
    })
  }
}