import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_FAIL,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_REQUEST,
  MY_ORDERS_REQUEST,
  MY_ORDERS_SUCCESS,
  MY_ORDERS_FAIL,
  MY_ORDERS_RESET,
} from '../constants/orderConstants'

export const orderReducer = (state = { order: {} }, action) => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
      return { loading: true }

    case CREATE_ORDER_SUCCESS:
      return { loading: false, success: true, order: action.payload }

    case CREATE_ORDER_FAIL:
      return { loading: false, error: action.payload }

    default:
      return state
  }
}

export const orderDetailsReducer = (
  state = { loading: true, orderItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case ORDER_DETAILS_REQUEST:
      return { ...state, loading: true }

    case ORDER_DETAILS_SUCCESS:
      return { loading: false, order: action.payload }

    case ORDER_DETAILS_FAIL:
      return { loading: false, error: action.payload }

    default:
      return state
  }
}

export const orderPayReducer = (state = {}, action) => {
  switch (action.type) {
    case ORDER_PAY_REQUEST:
      return { loading: true }

    case ORDER_PAY_SUCCESS:
      return { loading: false, success: true }

    case ORDER_PAY_FAIL:
      return { loading: false, error: action.payload }

    default:
      return state
  }
}

export const myOrdersReducer = (state = {}, action) => {
  switch (action.type) {
    case MY_ORDERS_REQUEST:
      return { loading: true }

    case MY_ORDERS_SUCCESS:
      return { loading: false, orders: action.payload }

    case MY_ORDERS_FAIL:
      return { loading: false, error: action.payload }

    case MY_ORDERS_RESET:
      return {}

    default:
      return state
  }
}
