import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Table, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { listProduct } from '../actions/productActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(faPlus)
const plus = <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} />

const ProductListScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login')
    } else {
      dispatch(listProduct())
    }
  }, [dispatch, userInfo, navigate])

  const productList = useSelector((state) => state.productList)
  const { loading, products, error } = productList

  const deleteProductHandler = (id) => {
    // delete product
  }

  const editProductHandler = (id) => {
    navigate(`/api/admin/users/${id}/edit`)
  }

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h2 style={{ margin: '24px 0' }}>Products</h2>
        </Col>
        <Col style={{ position: 'relative', height: '100px' }}>
          <Button
            className='my-3'
            style={{ position: 'absolute', right: '12px', top: '12px' }}
          >
            {plus}
            Create product
          </Button>
        </Col>
      </Row>
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
              <th>Price</th>
              <th>Category</th>
              <th>Brand</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
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
                      onClick={() => editProductHandler(product._id)}
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
                      onClick={() => deleteProductHandler(product._id)}
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

export default ProductListScreen
