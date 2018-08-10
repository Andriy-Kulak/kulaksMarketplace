import { reset } from 'redux-form'
import { displayError, displaySuccess } from '../../util/displayMessage'
import {
  CREATE_SHOP,
  GET_ALL_OWNER_STORES,
  CREATE_PRODUCT,
  GET_PRODUCTS_BY_SHOP,
  SELECTED_PRODUCT,
  CLEAR_EXISTING_PRODUCT,
  CHECK_SHOP_BALANCE,
  GET_ALL_USER_SHOPS,
  GET_SHOP_DETAILS
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
    // console.log('xxx web3.eth.getBlock(latest)', await web3.eth.getBlock('latest'))
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
      console.log('xxx reponse[1].c[0] lengthOfArray', lengthOfArray)
      let counter = 0
      const shopsArray = []
      const getShopIdsArray = []
      const getShopInfoArray = []

      while (counter < lengthOfArray) {
        getShopIdsArray.push(contractInstance.shopIds(account, counter, { from: account }))
        counter += 1
      }
      try {
        const storeIdResp = await Promise.all(getShopIdsArray)
        storeIdResp.forEach((x) => {
          if (x.c && x.c[0]) {
            const storeId = x.c[0]
            getShopInfoArray.push(contractInstance.shops(storeId, { from: account }))
          }
        })
        const storeInfoResp = await Promise.all(getShopInfoArray)
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
        displayError(e.message)
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
          const id = x[0].toNumber()
          const name = x[1]
          const description = x[2]
          const price = x[3].toNumber()
          const productStoreId = x[4].toNumber()
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
      displayError(e.message)
    }
  }
}

export function shopCreated(result) {
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
    try {
      dispatch(startLoading('newShop'))
      const result = await contractInstance.createShop(name, type, description, { from: account, gas: 550000 })
      console.log('xxx CREATED STORE RESULT =========', result)
      if (result.receipt) {
        // console.log('xxxx web3.eth.blockNumber =========', web3.eth.blockNumber)
        console.log('xxxx blocknumber', result.receipt.blockNumber)
        displaySuccess(`You have successfully creates a shop called ${name}`)
        dispatch(reset('newShop')) // reset form
        // trigger methods so you get the latest list of shops
        dispatch(getAllShopsByOwner({ contractInstance, account })) // get udated list of shops
      } else {
        displayError(`There was an error creating shop alled ${name}`)
      }

      dispatch(finishLoading('newShop')) // hide loading button for form
    } catch (e) {
      displayError(e.message)
      dispatch(clearAllLoading())
      alert('There was an error with creating the Shop. Make sure you are a shop owner before creating a shop.')
      console.log('ERROR', e)
      console.log('ERROR message', e.message)
    }
  }
}

export function createProduct({ contractInstance, name, description, price, account, shopId }) {
  
  return async (dispatch) => {
    const parsedPrice = parseInt(price, 10)
    console.log('parsedPrice =======================>', parsedPrice)
    try {
      dispatch(startLoading('newProduct')) // show loading button for create product form
      const result = await contractInstance.createProduct(shopId, name, description, parsedPrice, { from: account })
      console.log(' RESULT FROM CREATE PRODUCT ACTION', result)
      if (result.receipt) {
        displaySuccess('You successfully created a product')
        dispatch(getAllProductsByShop({ shopId, contractInstance, account }))
        dispatch(reset('newProduct')) // reset form
      } else {
        displayError('There was an error with creating a product')
        console.log('RESULT FROM CREATING A PRODUCT', result)
      }
      dispatch(finishLoading('newProduct')) // hide loading button for form
    } catch (e) {
      displayError(e.message)
      dispatch(clearAllLoading())
      console.log('ERROR CREATING PRODUCT', e)
    }
  }
}

export function selectProduct({ contractInstance, productId, account }) {
  return async (dispatch) => {
    try {
      console.log('contractInstance ==============>', contractInstance)
      const result = await contractInstance.products(productId, { from: account })
      const adjustedResponse = {
        id: result[0].toNumber(),
        name: result[1],
        description: result[2],
        price: result[3].toNumber(),
        shopId: result[4].toNumber()
      }

      if (prodRespConfirm(adjustedResponse)) {
        dispatch(productSelected(adjustedResponse))
      } else {
        console.log('ERROR with productSelect result. Check the response', result)
      }
    } catch (e) {
      displayError(e.message)
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
      console.log('DETAILED RESULT yyyy', result.toString())
      console.log('DETAILED RESULT yyyy 2222', result.c[0])
      dispatch({
        type: CHECK_SHOP_BALANCE,
        payload: {
          [shopId]: result.toString()
        }
      })
    } catch (e) {
      displayError(e.message)
    }
  }
}

export function withdrawBalance({ shopId, account, contractInstance }) {
  return async (dispatch) => {
    try {
      dispatch(startLoading('withdraw')) // show loading button for withdraw button
      const withdrawResult = await contractInstance.moveShopBalanceToOwner(shopId, { from: account, gas: 550000 })
      if (withdrawResult.receipt) {
        dispatch(checkShopBalance({ shopId, account, contractInstance })) // update shop balance
        displaySuccess(`You have successfully withdrawn from the shop balance into account: ${account}`)
      } else {
        displayError('There was an error withdrawing.')
        console.log('THERE IS an error withdrawing the request. Error 1', withdrawResult)
      }

      const result = await contractInstance.shopBalances(shopId, { from: account, gas: 550000 })
      console.log('CHECK SHOP BALANCE RESULT', result)
      console.log('DETAILED RESULT', result.c[0])
      dispatch({
        type: CHECK_SHOP_BALANCE,
        payload: {
          [shopId]: result.c[0]
        }
      })
      dispatch(finishLoading('withdraw')) // hide loading button for withdraw button
    } catch (e) {
      displayError(e.message)
      console.log('THERE IS an error withdrawing the request', e)
      dispatch(clearAllLoading())
    }
  }
}

export function purchaseProduct({ contractInstance, quantity, totalCost, account, productId }) {
  return async (dispatch) => {
    try {
      dispatch(startLoading('purchaseProduct'))
      const result = await contractInstance.purchaseProduct(productId, quantity, { from: account, value: totalCost })
      if (typeof result.tx === 'string') {
        displaySuccess('You have successfully purchased a product')
      }
      dispatch(finishLoading('purchaseProduct'))
      console.log('RESULT', result)
    } catch (e) {
      dispatch(clearAllLoading())
      displayError(e.message)
      console.log('error purchasing product', e)
    }
  }
}

// Used when user wants to take a look at all available stores created by shop owners
export function getAllShops({ contractInstance, account }) {
  return async (dispatch) => {
    try {
      const result = await contractInstance.getShopsListLength({ from: account })

      const shopsListArray = []
      const shopsDetailsRequestArray = []
      const shopsDetailsResultArray = []
      if (result.c && result.c[0]) {
        const lengthOfArray = result.toNumber()
        let counter = 0

        while (counter < lengthOfArray) {
          shopsListArray.push(contractInstance.shopsList(counter, { from: account }))
          counter += 1
        }
        const shopsListResp = await Promise.all(shopsListArray)
        console.log('shopsListResp ====>', shopsListResp)


        shopsListResp.forEach((x) => {
          shopsDetailsRequestArray.push(contractInstance.shops(x, { from: account }))
        })
        const shopsResp = await Promise.all(shopsDetailsRequestArray)

        console.log('shopsResp ===?', shopsResp)
        shopsResp.forEach((x) => {
          const id = x[0].toNumber()
          const name = x[1]
          const type = x[2]
          const description = x[3]
          const owner = x[4]
          if (shopRespConfirm({ id, name, type, description })) {
            shopsDetailsResultArray.push({ id, name, type, description, owner })
          }
        })

        dispatch({
          type: GET_ALL_USER_SHOPS,
          payload: shopsDetailsResultArray
        })
      }
    } catch (e) {
      displayError(`Error getting all shops... ${e.message}`)
      console.log('ERROR getting all shops', e)
    }
  }
}

export function getSpecificShop({ contractInstance, account, shopId }) {
  return async (dispatch) => {
    try {
      const result = await contractInstance.shops(shopId, { from: account })

      if (result.length === 5) { // ensuring that we are getting a response with appropriate data
        const id = result[0].toNumber()
        const name = result[1]
        const type = result[2]
        const description = result[3]
        const owner = result[4]
        dispatch({
          type: GET_SHOP_DETAILS,
          payload: { id, name, type, description, owner }
        })
      } else {
        displayError(`Error #2 getting getting  shop with id =${shopId}`)
        console.log('RESPONSE FRO getSpecificShop', result)
      }
    } catch (e) {
      displayError(`Error getting getting  shop with id =${shopId} ... ${e.message}`)
      console.log('ERROR getting shop', e)
    }
  }
}