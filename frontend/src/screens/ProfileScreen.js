import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getMyOrders } from '../actions/orderActions'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(faTimes)
const xSymbol = <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />

const RegisterScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userDetails = useSelector((state) => state.userDetails)
  const { user, error, loading } = userDetails

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const { success } = userUpdateProfile

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const myOrders = useSelector((state) => state.myOrders)
  const { orders, loading: loadingOrdersList } = myOrders

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    } else {
      if (!user.name) {
        dispatch(getUserDetails('profile'))
        dispatch(getMyOrders())
      } else {
        setName(user.name)
        setEmail(user.email)
      }
    }
  }, [navigate, dispatch, userInfo, user])

  const submitHandler = (e) => {
    setMessage('')
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }))
    }
  }

  return (
    <Row className='py-4'>
      <Col md={3}>
        <h2>USER PROFILE</h2>
        {error && <Message variant='danger' message={error} />}
        {message && <Message variant='danger' message={message} />}
        {success && message === '' ? (
          <Message variant='success' message='Profile updated' />
        ) : null}
        {loading && <Loader />}
        <Form className='py-4'>
          <Form.Group className='mb-3' controlId='formBasicEmail'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='name'
              placeholder='Enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='formBasicEmail'>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='formBasicPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='formBasicPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant='primary' type='submit' onClick={submitHandler}>
            Update
          </Button>
        </Form>
      </Col>

      <Col md={{ span: 9 }}>
        <h2>MY ORDERS</h2>
        {loadingOrdersList ? (
          <Loader />
        ) : (
          <Table striped bordered hover size='sm' style={{ marginTop: '18px' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders &&
                orders.map((order) => (
                  <tr>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>${order.totalPrice}</td>
                    <td>
                      {order.isPaid ? order.paidAt.substring(0, 10) : xSymbol}
                    </td>
                    <td>
                      {order.isDelivered
                        ? order.deliveredAt.substring(0, 10)
                        : xSymbol}
                    </td>
                    <td
                      style={{
                        padding: '6px',
                        position: 'relative',
                      }}
                    >
                      <Button
                        variant='outline-dark'
                        size='sm'
                        style={{
                          padding: '4px 16px',
                        }}
                        href={`/api/orders/order/${order._id}`}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  )
}

export default RegisterScreen
