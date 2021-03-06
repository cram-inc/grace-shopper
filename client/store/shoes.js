import axios from 'axios'

const SHOE = 'SHOE'
const SHOES = 'SHOES'
const BRANDED_SHOES = 'BRANDED_SHOES'

const REMOVE_SHOE = 'REMOVE_SHOE'
//const REMOVE_SHOES = 'REMOVE_SHOES';

const initialState = {
  shoe: {},
  shoes: []
}

export const getSingleShoe = shoe => ({
  type: SHOE,
  shoe
})
export const getMultipleShoes = shoes => ({
  type: SHOES,
  shoes
})
export const getShoesByBrand = shoes => ({
  type: BRANDED_SHOES,
  shoes
})

export const removeShoe = id => ({type: REMOVE_SHOE, id})

export const getShoeThunk = id => async dispatch => {
  try {
    const {data} = await axios.get(`/api/shoes/${id}`)
    dispatch(getSingleShoe(data))
  } catch (error) {
    console.error(error)
  }
}

export const getShoesThunk = () => async dispatch => {
  try {
    const {data} = await axios.get(`/api/shoes`)
    dispatch(getMultipleShoes(data))
  } catch (error) {
    console.error(error)
  }
}

export const getShoesByBrandThunk = brand => async dispatch => {
  try {
    const {data} = await axios.get(`/api/shoes/shoeBrand/${brand}`)
    dispatch(getShoesByBrand(data))
  } catch (error) {
    console.error(error)
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOE:
      return {...state, shoe: action.shoe}
    case SHOES:
      return {...state, shoes: action.shoes}
    case BRANDED_SHOES:
      return {...state, shoes: action.shoes}
    default:
      return state
  }
}
