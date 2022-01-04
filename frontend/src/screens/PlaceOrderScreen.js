import React, { useEffect } from 'react'
import { Button, Row, Col, ListGroup, Image } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import CheckOutSteps from '../components/CheckOutSteps'
import Message from '../components/Message'
import { createOrder } from '../actions/orderActions'
import { useNavigate } from 'react-router-dom'

const PlaceOrderScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cart = useSelector((state) => state.cart)
  const { shippingAddress, paymentMethod, cartItems } = cart

  const { address, postalCode, city, country } = shippingAddress

  const orderCreate = useSelector((state) => state.order)
  const { success, order, error } = orderCreate

  useEffect(() => {
    if (success) {
      navigate(`/orders/${order._id}`)
    }
  }, [success, navigate])

  cart.itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  )
  cart.taxPrice = Number(cart.itemsPrice * 0.15)
  cart.shippingPrice = cart.itemsPrice > 100 ? 100 : 0
  cart.totalPrice = Number(cart.itemsPrice + cart.taxPrice + cart.shippingPrice)

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cartItems,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        itemsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      })
    )
  }

  return (
    <>
      <Row className='justify-content-center py-4'>
        <CheckOutSteps step1 step2 step3 step4 />
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item className='mb-2'>
              <h2>SHIPPING</h2>
              <p>
                <strong>Address: </strong>
                {address}, {postalCode}, {city}, {country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item className='mb-2'>
              <h2>PAYMENT</h2>
              <p>
                <strong>Method: </strong>
                {paymentMethod}
              </p>
            </ListGroup.Item>

            <ListGroup.Item className='mt-4'>
              <h2>Order Items</h2>
              <ListGroup variant='flush'>
                {cartItems.length === 0 ? (
                  <Message variant='danger' message='Your cart is empty' />
                ) : (
                  cartItems.map((item, index) => (
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
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        {/* </Row>
      <Row> */}
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h2 className='pt-3'>ORDER SUMMARY</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Items</Col>
                <Col>${cart.itemsPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Shipping</Col>
                <Col>${cart.shippingPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Tax</Col>
                <Col>${cart.taxPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Total</Col>
                <Col>${cart.totalPrice.toFixed(2)}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item className='d-grid'>
              {error && <Message variant='danger' message={error} />}
              <Button variant='primary' onClick={placeOrderHandler}>
                PLACE ORDER
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen
