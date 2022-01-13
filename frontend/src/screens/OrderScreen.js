import React, { useState, useEffect } from 'react'
import { Row, Col, ListGroup, Image } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Message from '../components/Message'
import { getOrderDetails, payOrder } from '../actions/orderActions'
import { useParams } from 'react-router-dom'
import Loader from '../components/Loader'
import { PayPalButton } from 'react-paypal-button-v2'

const OrderScreen = () => {
  const dispatch = useDispatch()
  const orderId = useParams().id

  const [sdkReady, setSdkReady] = useState(false)

  const orderDetails = useSelector((state) => state.orderDetails)
  const { loading, order, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, success: successPay } = orderPay

  useEffect(() => {
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
      dispatch(getOrderDetails(orderId))
      addPayPalScript()
    }

    if (order && !successPay) {
      if (!window.paypal) {
        console.log(sdkReady, 'after loading script')
      }
    } else if (successPay) {
      order.isPaid = true
    }
  }, [
    dispatch,
    orderId,
    order,
    loading,
    loadingPay,
    successPay,
    orderPay.isPaid,
  ])

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)
    dispatch(payOrder(orderId, paymentResult))
  }

  return (
    <>
      {loading ? (
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
                {!order.isDelivered && (
                  <Message variant='danger' message='Not delivered' />
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
            </ListGroup>
          </Col>
        </Row>
      )}
    </>
  )
}

export default OrderScreen
