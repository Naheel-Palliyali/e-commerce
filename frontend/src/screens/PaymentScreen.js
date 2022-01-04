import React, { useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { savePaymentMethod } from '../actions/cartActions'
import CheckOutSteps from '../components/CheckOutSteps'

const PaymentScreen = () => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  const navigate = useNavigate()

  if (!shippingAddress) {
    navigate('/shipping')
  }

  const [paymentMethod, setPaymentMethod] = useState('')

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    navigate('/placeorder')
  }

  return (
    <Row className='justify-content-center py-4'>
      <CheckOutSteps step1 step2 step3 />
      <Col md={6}>
        <Form>
          <h2 className='pt-4' style={{ textAlign: 'center' }}>
            SELECT PAYMENT METHOD
          </h2>
          <Form.Group className='py-4'>
            <Form.Check
              type='radio'
              id='PayPal'
              label='PayPal or credit card'
              value='PayPal'
              name='paymentMethod'
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <Form.Check
              type='radio'
              id='UPI'
              label='UPI'
              value='UPI'
              name='paymentMethod'
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </Form.Group>
        </Form>
        <Button
          className='mt-2'
          variant='primary'
          type='submit'
          onClick={submitHandler}
        >
          Continue
        </Button>
      </Col>
    </Row>
  )
}

export default PaymentScreen
