import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { ListGroup, Row, Col, Button, Card, Image, ListGroupItem } from 'react-bootstrap'
import Rating from '../components/Rating'
import products from '../products'

const ProductScreen = () => {
    const params = useParams()
    const product = products.find( (p) => p._id === params.id )

    return (
        <>
            <Link to='/' className='btn btn-light my-3'>
                Go back
            </Link>
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
                        <ListGroupItem>
                            Price: ${product.price}
                        </ListGroupItem>
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
                                <Col>
                                    Price: {product.price}
                                </Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>
                                    Status: {product.countInStock > 0 ? 'In stock' : 'Out of Stock'}
                                </Col>
                            </Row>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Row>
                                <Col>
                                    <Button className='btn btn-block rounded' type='button' disabled={product.countInStock < 1}>Add to cart</Button>
                                </Col>
                            </Row>
                        </ListGroupItem>
                    </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default ProductScreen
