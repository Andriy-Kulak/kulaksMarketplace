import { reset } from 'redux-form'
import { CREATE_SHOP, GET_ALL_OWNER_STORES, CREATE_PRODUCT, GET_PRODUCTS_BY_SHOP } from './constants'

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
        getShopIdsArray.push(contractInstance.getShopIdByOrder(counter))
        console.log('counter ----', counter)
        counter += 1
      }

      const storeIdResp = await Promise.all(getShopIdsArray)
      console.log('storeIdResp ==>', storeIdResp)
      console.log('getStoreIdsArray ==>', getShopIdsArray)
      storeIdResp.forEach((x) => {
        console.log('ARE WE GETTING HEREEEE store', x)
        if (x[0] === true && x[1].c[0]) {
          const storeId = x[1].c[0]
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
    }
  }
}

export function getAllProductsByShop({ contractInstance, account, shopId }) {  
  return async (dispatch) => {
    const products = []
    const storeProdResp = await contractInstance.doesStoreHaveProducts(shopId, { from: account })
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
        getProductIdsArray.push(contractInstance.getProductIdByOrder(shopId, counter))
        console.log('counter ----', counter)
        counter += 1
      }
      const productIdResp = await Promise.all(getProductIdsArray)
      console.log('LENGTH of PRODUCTS ARRAY', lengthOfArray)
      console.log('productIdResp ===>', productIdResp)
      productIdResp.forEach((x) => {
        console.log('ARE WE GETTING HEREEEE product', x)
        if (x[0] === true && x[1].c[0]) {
          const productId = x[1].c[0]
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

export function createShop({ contractInstance, name, type, description, account }) {
  return async (dispatch) => {
    console.log('contractInstance ===>', contractInstance)
    contractInstance.createShop(name, type, description, { from: account, gas: 550000 }).then((result) => {
      console.log('CREATED STORE RESULT =========', result)
      dispatch(shopCreated(result))
      dispatch(reset('newShop')) // clear fields from newStore form

      // trigger methods so you get the latest list of shops
      dispatch(getAllShopsByOwner({ contractInstance, account }))
    }).catch((e) => {
      console.log('ERROR', e)
      console.log('ERROR message', e.message)
    })
  }
}

export function createProduct({ contractInstance, name, description, price, account, shopId }) {
  return async (dispatch) => {
    const parsedPrice = parseInt(price, 10)
    try {
      const result = await contractInstance.createProduct(shopId, name, description, parsedPrice, { from: account })
      console.log(' RESULT FROM CREATE PRODUCT ACTION', result)
      dispatch(productCreated(result))
      dispatch(getAllProductsByShop({ shopId, contractInstance, account }))
      dispatch(reset('newProduct'))
    } catch (e) {
      console.log('ERROR', e)
      console.log('ERROR message', e.message)
    }
  }
}