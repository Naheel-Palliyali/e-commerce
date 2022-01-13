import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { listOrders } from '../actions/orderActions'

library.add(faTimes)
const xSymbol = <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />
const tick = <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} />

const OrderListScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const ordersList = useSelector((state) => state.ordersList)
  const { orders, loading, error } = ordersList

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login')
    } else {
      dispatch(listOrders())
    }
  }, [dispatch, userInfo, navigate])

  const getDetailsHandler = (id) => {
    navigate(`/api/orders/order/${id}`)
  }

  return (
    <>
      <h2 style={{ margin: '24px 0' }}>ORDERS</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message message={error} variant='danger' />
      ) : (
        <Table striped responsive bordered hover size='sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Date</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user.name}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>{order.isPaid ? tick : xSymbol}</td>
                  <td>{order.isDelivered ? tick : xSymbol}</td>
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
                        width: '74px',
                      }}
                      onClick={() => getDetailsHandler(order._id)}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default OrderListScreen
