import React, { useEffect, useState } from 'react'
import { Col, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getUserDetails, updateUser } from '../actions/userActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { USER_EDIT_RESET } from '../constants/userConstants'

const UserEditScreen = () => {
  const id = useParams().id
  const navigate = useNavigate()

  const userDetails = useSelector((state) => state.userDetails)
  const { user, error, loading } = userDetails

  const userEdit = useSelector((state) => state.userEdit)
  const { error: errorEdit, success, loading: loadingEdit } = userEdit

  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [admin, setAdmin] = useState(user.isAdmin)

  const userUpdate = {
    _id: id,
    name: name,
    email: email,
    isAdmin: admin,
  }

  const dispatch = useDispatch()

  useEffect(() => {
    if (
      !user.name ||
      user._id !== id ||
      user.name !== name ||
      user.email !== email ||
      user.isAdmin !== admin
    )
      dispatch(getUserDetails(id))

    if (success) {
      dispatch({ type: USER_EDIT_RESET })
      navigate('/api/admin/users')
    }

    if (!loading) {
      setName(user.name)
      setEmail(user.email)
      setAdmin(user.isAdmin)
    }
    // eslint-disable-next-line
  }, [dispatch, user, id, success, userEdit])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(updateUser(userUpdate))
  }

  return (
    <>
      <Link to='/api/admin/users'>
        <Button
          variant='outline-secondary'
          size='sm'
          style={{ padding: '4px 8px', borderColor: 'white' }}
        >
          Go back
        </Button>
      </Link>
      <h1>Edit User</h1>
      {error && <Message variant='danger' message={error} />}
      {errorEdit && <Message variant='danger' message={errorEdit} />}
      {loading || loadingEdit ? (
        <Loader />
      ) : (
        <Col xs={12} md={8}>
          <Form>
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
            <Form.Group className='mb-3' controlId='isAdmin'>
              <Form.Check
                type='checkbox'
                label='Is Admin'
                checked={admin}
                onChange={(e) => setAdmin(!admin)}
              />
            </Form.Group>

            <Button variant='primary' type='submit' onClick={submitHandler}>
              Update
            </Button>
          </Form>
        </Col>
      )}
    </>
  )
}

export default UserEditScreen
