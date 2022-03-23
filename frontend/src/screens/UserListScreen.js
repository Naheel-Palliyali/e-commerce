import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { deleteUser, listUsers } from '../actions/userActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(faTimes)
const xSymbol = <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />
const tick = <FontAwesomeIcon icon={faCheck} style={{ color: 'green' }} />

const UserListScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const userList = useSelector((state) => state.userList)
    const { loading, userList: users, error } = userList

    const userEdit = useSelector((state) => state.userEdit)
    const userDelete = useSelector((state) => state.userDelete)
    const { success } = userDelete

    useEffect(() => {
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login')
        } else {
            dispatch(listUsers())
        }
    }, [dispatch, userInfo, navigate, success, userEdit])

    const deleteUserHandler = (id) => {
        if (window.confirm('Are you sure?')) {
            dispatch(deleteUser(id))
        }
    }

    const editUserHandler = (id) => {
        navigate(`/api/admin/users/${id}/edit`)
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
                                    <td>{user.isAdmin ? tick : xSymbol}</td>
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
                                                marginRight: '12px',
                                            }}
                                            onClick={() =>
                                                editUserHandler(user._id)
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant='outline-danger'
                                            size='sm'
                                            color='red'
                                            style={{
                                                padding: '4px 16px',
                                                width: '74px',
                                            }}
                                            onClick={() =>
                                                deleteUserHandler(user._id)
                                            }
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
