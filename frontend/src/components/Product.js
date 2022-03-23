import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Rating from './Rating'
import { PRODUCT_DETAILS_REQUEST } from '../constants/productConstants'
import { useDispatch } from 'react-redux'

const Product = ({ product }) => {
    const dispatch = useDispatch()

    const clickProductHandler = () => {
        dispatch({ type: PRODUCT_DETAILS_REQUEST })
    }

    return (
        <Card className='my-3 p-3 rounded' style={{ height: '415px' }}>
            <Link to={`/product/${product._id}`}>
                <Card.Img
                    className='rounded'
                    src={product.image}
                    variant='top'
                    onClick={clickProductHandler}
                    style={{
                        height: '232px',
                        width: '100%',
                        objectFit: 'cover',
                    }}
                    fluid
                />
            </Link>
            <Card.Body>
                <Link to={`/product/${product._id}`}>
                    <Card.Title
                        as='div'
                        onClick={clickProductHandler}
                        style={{ height: '48px' }}
                    >
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>
                <Card.Text as='div'>
                    <div className='my-3'>
                        <Rating
                            value={product.rating}
                            text={`${product.numReviews} reviews`}
                        />
                    </div>
                </Card.Text>
                <Card.Text as='h3'>${product.price}</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Product
