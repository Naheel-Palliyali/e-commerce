import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Table } from 'react-bootstrap'
import { listUsers } from '../actions/userActions'
import Message from '../components/Message'
import Loader from '../components/Loader'

const UserListScreen = () => {
  const dispatch = useDispatch()

  const userList = useSelector((state) => state.userList)
  const { loading, userList: users, error } = userList

  useEffect(() => {
    dispatch(listUsers())
  }, [dispatch])

  const deleteUserHandler = (id) => {
    console.log('delete')
  }

  const editUserHandler = (id) => {
    console.log('edit')
  }

  return (
    <>
      <h2 style={{ margin: '24px 0' }}>USERS</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message message={error} variant='danger' />
      ) : (
        <Table striped responsive bordered hover size='sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin ? 'Yes' : 'No'}</td>
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
                      onClick={() => editUserHandler(user._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant='outline-danger'
                      size='sm'
                      color='red'
                      style={{
                        padding: '4px 16px',
                        marginLeft: '12px',
                        width: '74px',
                      }}
                      onClick={() => deleteUserHandler(user._id)}
                    >
                      Delete
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

export default UserListScreen
