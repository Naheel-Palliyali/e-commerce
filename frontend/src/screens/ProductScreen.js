import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  ListGroup,
  Row,
  Col,
  Button,
  Card,
  Image,
  ListGroupItem,
  Form,
} from 'react-bootstrap'
import Rating from '../components/Rating'
import { useDispatch, useSelector } from 'react-redux'
import { listProductDetail } from '../actions/productActions'
import { addToCart } from '../actions/cartActions'
import Loader from '../components/Loader'
import Message from '../components/Message'

const ProductScreen = () => {
  let navigate = useNavigate()

  const params = useParams().id
  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  useEffect(() => {
    dispatch(listProductDetail(params))
  }, [dispatch, params])

  const [qty, setQty] = useState(1)
  const addToCartHandler = () => {
    navigate(`/cart/${params}?qty=${qty}`)
    dispatch(addToCart(params, qty))
  }

  return (
    <>
      <Link to='/'>
        <Button
          variant='outline-secondary'
          size='sm'
          style={{
            padding: '4px 8px',
            borderColor: 'white',
            marginBottom: '12px',
          }}
        >
          Go back
        </Button>
      </Link>
      {loading ? (
        <Row>
          <Loader />
        </Row>
      ) : error ? (
        <Message variant='danger' message='error' />
      ) : (
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>
          <Col md={3}>
            <ListGroup>
              <ListGroupItem>
                <h3>{product.name}</h3>
              </ListGroupItem>
              <ListGroupItem>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </ListGroupItem>
              <ListGroupItem>Price: ${product.price}</ListGroupItem>
              <ListGroupItem>Description: {product.description}</ListGroupItem>
            </ListGroup>
          </Col>

          <Col md={3}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroupItem>
                  <Row>
                    <Col>Price: {product.price}</Col>
                  </Row>
                </ListGroupItem>
                <ListGroupItem>
                  <Row>
                    <Col>
                      Status:{' '}
                      {product.countInStock > 0 ? 'In stock' : 'Out of Stock'}
                    </Col>
                  </Row>
                </ListGroupItem>
                {product.countInStock > 0 && (
                  <ListGroupItem>
                    <Row>
                      <Col>Qty:</Col>
                      <Col>
                        <Form.Select
                          aria-label='Select quantity'
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {[...Array(product.countInStock).keys()].map(
                            (x, index) => (
                              <option key={index} value={x + 1}>
                                {x + 1}
                              </option>
                            )
                          )}
                        </Form.Select>
                      </Col>
                    </Row>
                  </ListGroupItem>
                )}
                <ListGroupItem>
                  <Row>
                    <Col>
                      <Button
                        onClick={addToCartHandler}
                        className='btn btn-block rounded'
                        type='button'
                        disabled={product.countInStock < 1}
                      >
                        Add to cart
                      </Button>
                    </Col>
                  </Row>
                </ListGroupItem>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  )
}

export default ProductScreen
