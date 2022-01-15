import React, { useState, useEffect } from 'react'
import { Row, Col, ListGroup, Image, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Message from '../components/Message'
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../actions/orderActions'
import { useParams, useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import { PayPalButton } from 'react-paypal-button-v2'
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from '../constants/orderConstants'

const OrderScreen = () => {
  const dispatch = useDispatch()
  const orderId = useParams().id
  const navigate = useNavigate()

  const [sdkReady, setSdkReady] = useState(false)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderDetails = useSelector((state) => state.orderDetails)
  const { loading, order, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    }

    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal')
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.addEventListener('load', () => setSdkReady(true))
      document.body.appendChild(script)
    }
    if (!order || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
      addPayPalScript()
    }

    if (order && !successPay) {
      if (!window.paypal) {
        setSdkReady(true)
      }
    } else if (successPay) {
      order.isPaid = true
    }
    // eslint-disable-next-line
  }, [
    dispatch,
    orderId,
    loading,
    loadingPay,
    loadingDeliver,
    successDeliver,
    orderPay,
  ])

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult))
  }

  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }

  return (
    <>
      {loading || loadingDeliver ? (
        <Loader />
      ) : error ? (
        <Message variant='danger' message={error} />
      ) : (
        <Row className='justify-content-center py-4'>
          <h1>ORDER {orderId}</h1>

          <Col md={8}>
            <ListGroup variant='flush'>
              <ListGroup.Item className='mb-2'>
                <h2>SHIPPING</h2>
                <p>
                  <strong>Name: </strong>
                  {order ? order.user.name : null}
                </p>
                <p>
                  <strong>Email: </strong>
                  {order ? (
                    <a href={`mailto:${order.user.email}`}>
                      {' '}
                      {order.user.email}{' '}
                    </a>
                  ) : null}
                </p>
                <p>
                  <strong>Address: </strong>
                  {order.shippingAddress.address},{' '}
                  {order.shippingAddress.postalCode},{' '}
                  {order.shippingAddress.city}, {order.shippingAddress.country}
                </p>
                {!successDeliver && !order.isDelivered ? (
                  <Message variant='danger' message='Not delivered' />
                ) : (
                  <Message variant='success' message='Delivered' />
                )}
              </ListGroup.Item>

              <ListGroup.Item className='mb-2'>
                <h2>PAYMENT</h2>
                <p>
                  <strong>Method: </strong>
                  {order.paymentMethod}
                </p>
                {!successPay && !order.isPaid ? (
                  <Message variant='danger' message='Not paid' />
                ) : (
                  <Message variant='success' message='Paid' />
                )}
              </ListGroup.Item>

              <ListGroup.Item className='mt-4'>
                <h2>Order Items</h2>
                <ListGroup variant='flush'>
                  {order.orderItems.length === 0 ? (
                    <Message variant='danger' message='Your order is empty' />
                  ) : (
                    order.orderItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col>
                            <p>{item.name}</p>
                          </Col>
                          <Col md={4}>
                            {item.qty} x ${item.price} = $
                            {(item.qty * item.price).toFixed(2)}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))
                  )}
                </ListGroup>
              </ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={4}>
            <ListGroup>
              <ListGroup.Item>
                <h2 className='pt-3'>ORDER SUMMARY</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice.toFixed(2)}</Col>
                </Row>
              </ListGroup.Item>
              {!successPay && !order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice.toFixed(2)}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button onClick={deliverHandler}>Mark as delivered</Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Col>
        </Row>
      )}
    </>
  )
}

export default OrderScreen
