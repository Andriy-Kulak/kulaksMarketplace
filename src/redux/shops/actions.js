import { reset } from 'redux-form'
import message from 'antd/lib/message'
import displayError from '../../util/displayError'
import {
  CREATE_SHOP,
  GET_ALL_OWNER_STORES,
  CREATE_PRODUCT,
  GET_PRODUCTS_BY_SHOP,
  SELECTED_PRODUCT,
  CLEAR_EXISTING_PRODUCT,
  CHECK_SHOP_BALANCE
} from './constants'
import { startLoading, finishLoading, clearAllLoading } from '../loading/actions'


const prodRespConfirm = ({ id, name, description, price, shopId }) => {
  return (typeof id === 'number' && typeof name === 'string' && typeof price === 'number' && typeof description === 'string' && typeof shopId === 'number')
}

const shopRespConfirm = ({ id, name, type, description }) => {
  return (typeof id === 'number' && typeof name === 'string' && typeof type === 'string' && typeof description === 'string')
}

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

    if (response[0] === true && response[1] && response[1].c[0]) {
      const lengthOfArray = response[1].c[0]
      console.log('reponse[1].c[0] lengthOfArray', lengthOfArray)
      let counter = 0
      const shopsArray = []
      const getShopIdsArray = []
      const getShopInfoArray = []

      while (counter < lengthOfArray) {
        getShopIdsArray.push(contractInstance.shopIds(account, counter))
        counter += 1
      }
      try {
        const storeIdResp = await Promise.all(getShopIdsArray)
        console.log('storeIdResp ==>', storeIdResp)
        console.log('getStoreIdsArray ==>', getShopIdsArray)
        storeIdResp.forEach((x) => {
          console.log('ARE WE GETTING HEREEEE store', x)
          console.log('ARE WE GETTING HEREEEE 22222 store', x.c)
          if (x.c && x.c[0]) {
            const storeId = x.c[0]
            getShopInfoArray.push(contractInstance.shops(storeId, { from: account }))
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
      } catch (e) {
        displayError(e)
        console.log('shopIdsArray', getShopIdsArray)
        console.log('WHAT IS THE ERROR IN store id RESP', e)
      }
    }
  }
}

export function getAllProductsByShop({ contractInstance, account, shopId }) {  
  return async (dispatch) => {
    try {
      const products = []
      const storeProdResp = await contractInstance.doesShopHaveProducts(shopId, { from: account })
      if (storeProdResp[0] === false) {
        return dispatch({
          type: GET_PRODUCTS_BY_SHOP,
          payload: products // store does not have any products so return back an empty object
        })
      }
      if (storeProdResp[0] === true && storeProdResp[1] && storeProdResp[1].c[0]) {
        const lengthOfArray = storeProdResp[1].c[0]
        let counter = 0
        const getProductIdsArray = []
        const getProductInfoArray = []
        while (counter < lengthOfArray) {
          getProductIdsArray.push(contractInstance.productIds(shopId, counter))
          counter += 1
        }
        const productIdResp = await Promise.all(getProductIdsArray)
        console.log('LENGTH of PRODUCTS ARRAY', lengthOfArray)
        console.log('productIdResp ===>', productIdResp)
        productIdResp.forEach((x) => {
          console.log('ARE WE GETTING HEREEEE product', x)
          if (x.c && x.c[0]) {
            const productId = x.c[0]
            getProductInfoArray.push(contractInstance.products(productId, { from: account }))
          }
        })

        const productInfoResp = await Promise.all(getProductInfoArray)
        productInfoResp.forEach((x) => {
          const id = x[0].c[0]
          const name = x[1]
          const description = x[2]
          const price = x[3].c[0]
          const productStoreId = x[4].c[0]
          if (prodRespConfirm({ id, name, description, price, shopId: productStoreId })) {
            products.push({ id, name, description, price, storeId: productStoreId })
          }
        })
        console.log('productInfoResp ==>', productInfoResp)
        console.log('PRODCUTS ======>', products)
        return dispatch({
          type: GET_PRODUCTS_BY_SHOP,
          payload: {
            [shopId]: products
          }
        })
      }
    } catch (e) {
      displayError(e)
    }
  }
}

function shopCreated(result) {
  return ({
    type: CREATE_SHOP,
    payload: result
  })
}


export function productCreated(result) {
  return ({
    type: CREATE_PRODUCT,
    payload: result
  })
}

export function productSelected(result) {
  return ({
    type: SELECTED_PRODUCT,
    payload: result
  })
}

export function createShop({ contractInstance, name, type, description, account }) {
  return async (dispatch) => {
    console.log('contractInstance ===>', contractInstance)
    dispatch(startLoading('newShop'))
    contractInstance.createShop(name, type, description, { from: account, gas: 550000 }).then((result) => {
      console.log('CREATED STORE RESULT =========', result)
      dispatch(shopCreated(result))
      dispatch(reset('newShop')) // reset form

      // trigger methods so you get the latest list of shops
      dispatch(getAllShopsByOwner({ contractInstance, account })) // get udated list of shops
      dispatch(finishLoading('newShop')) // hide loading button for form
    }).catch((e) => {
      displayError(e)
      dispatch(clearAllLoading())
      alert('There was an error with creating the Shop. Make sure you are a shop owner before creating a shop.')
      console.log('ERROR', e)
      console.log('ERROR message', e.message)
    })
  }
}

export function createProduct({ contractInstance, name, description, price, account, shopId }) {
  return async (dispatch) => {
    const parsedPrice = parseInt(price, 10)
    try {
      dispatch(startLoading('newProduct')) // show loading button for create product form
      const result = await contractInstance.createProduct(shopId, name, description, parsedPrice, { from: account })
      console.log(' RESULT FROM CREATE PRODUCT ACTION', result)
      dispatch(productCreated(result))
      dispatch(getAllProductsByShop({ shopId, contractInstance, account }))
      dispatch(reset('newProduct')) // reset form
      dispatch(finishLoading('newProduct')) // hide loading button for form
    } catch (e) {
      displayError(e)
      dispatch(clearAllLoading())
      console.log('ERROR', e)
      console.log('ERROR message', e.message)
    }
  }
}

export function selectProduct({ contractInstance, productId, account }) {
  return async (dispatch) => {
    try {
      console.log('contractInstance ==============>', contractInstance)
      const result = await contractInstance.products(productId, { from: account })
      const adjustedResponse = {
        id: result[0].c[0],
        name: result[1],
        description: result[2],
        price: result[3].c[0],
        shopId: result[4].c[0]
      }
      console.log('adjusted RESPONSE', adjustedResponse)
      if (prodRespConfirm(adjustedResponse)) {
        dispatch(productSelected(adjustedResponse))
      } else {
        console.log('ERROR with productSelect result. Check the response', result)
      }
    } catch (e) {
      displayError(e)
      dispatch(clearAllLoading())
      console.log('ERROR with selectProduct', e)
      console.log('ERROR message', e.message)
    }
  }
}

export function clearExistingProduct() {
  return ((dispatch) => {
    dispatch({
      type: CLEAR_EXISTING_PRODUCT
    })
  })
}

export function checkShopBalance({ shopId, account, contractInstance }) {
  return async (dispatch) => {
    try {
      const result = await contractInstance.shopBalances(shopId, { from: account, gas: 550000 })
      console.log('CHECK SHOP BALANCE RESULT', result)
      console.log('DETAILED RESULT', result.c[0])
      dispatch({
        type: CHECK_SHOP_BALANCE,
        payload: {
          [shopId]: result.c[0]
        }
      })
    } catch (e) {
      displayError(e)
    }
  }
}

export function withdrawBalance({ shopId, account, contractInstance }) {
  return async (dispatch) => {
    try {
      const withdrawResult = await contractInstance.moveShopBalanceToOwner(shopId, { from: account, gas: 550000 })
      if (!withdrawResult.receipt) {
        console.log('THERE IS an error withdrawing the request. Error 1', withdrawResult)
      } else {
        const result = await contractInstance.shopBalances(shopId, { from: account, gas: 550000 })
        console.log('CHECK SHOP BALANCE RESULT', result)
        console.log('DETAILED RESULT', result.c[0])
        dispatch({
          type: CHECK_SHOP_BALANCE,
          payload: {
            [shopId]: result.c[0]
          }
        })
      }
    } catch (e) {
      displayError(e)
      console.log('THERE IS an error withdrawing the request. Error 2', e.message)
      dispatch(clearAllLoading())
    }
  }
}

// Probably won't need this - AK
// export function purchaseProduct({ contractInstance, quantity, totalCost, account, productId }) {
//   return async (dispatch) => {
//     try {
//       const result = await contractInstance.purchaseProduct(productId, quantity, { from: account, value: totalCost })
//       if (typeof result.tx === 'string') {
//         message.success('You have successfully purchased a product')
//       }
//       console.log('RESULT', result)
//     } catch (e) {
//       dispatch(clearAllLoading())
//       displayError(e)
//     }
//   }
// }