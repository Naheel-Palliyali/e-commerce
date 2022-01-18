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
import { listProductDetail, reviewProduct } from '../actions/productActions'
import { addToCart } from '../actions/cartActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

const ProductScreen = () => {
  let navigate = useNavigate()

  const params = useParams().id
  const dispatch = useDispatch()

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productReview = useSelector((state) => state.productReview)
  const { success: successReview, error: errorReview } = productReview

  useEffect(() => {
    if (successReview) {
      alert('Review submitted')
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
      setComment('')
      setRating(0)
    }
    dispatch(listProductDetail(params))
    dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })

    if (product && params !== product._id) {
      dispatch(listProductDetail(params))
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
  }, [dispatch, params, successReview, product])

  const [qty, setQty] = useState(1)
  const addToCartHandler = () => {
    navigate(`/cart/${params}?qty=${qty}`)
    dispatch(addToCart(params, qty))
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      reviewProduct(params, {
        rating: Number(rating),
        comment: String(comment),
      })
    )
  }

  return (
    <>
      <Link to='/'>
        <Button
          variant='outline-secondary'
          size='sm'
          style={{
            padding: '4px 8px',
            border: 'none',
            marginBottom: '12px',
          }}
        >
          ← Back
        </Button>
      </Link>
      {loading ? (
        <Row>
          <Loader />
        </Row>
      ) : error ? (
        <Message variant='danger' message='error' />
      ) : (
        <>
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
                <ListGroupItem>
                  Description: {product.description}
                </ListGroupItem>
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
          <Row style={{ marginTop: '32px' }}>
            <Col md={6}>
              <h2>REVIEWS</h2>
              <ListGroup variant='flush'>
                {product.review.length === 0 && (
                  <Message message='No reviews yet' />
                )}
                {product.review.map((review) => (
                  <ListGroupItem key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroupItem>
                ))}
                <ListGroupItem>
                  <h2 style={{ margin: '24px 0' }}>Write a customer review</h2>
                  {errorReview && (
                    <Message variant='danger' message={errorReview} />
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group className='mb-3' controlId='Select'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Select
                          aria-label='Default select example'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option>Select rating...</option>
                          <option value='1'>1 - Poor</option>
                          <option value='2'>2 - Fair</option>
                          <option value='3'>3 - Good</option>
                          <option value='4'>4 - Very Good</option>
                          <option value='5'>5 - Great</option>
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className='mb-3' controlId='Textarea'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          rows={3}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </Form.Group>
                      <Button type='submit'>Submit review</Button>
                    </Form>
                  ) : (
                    <Message message={'Please sign in to write a review'} />
                  )}
                </ListGroupItem>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default ProductScreen
