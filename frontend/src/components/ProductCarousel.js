import React, { useEffect } from 'react'
import { Carousel, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { getTopProducts } from '../actions/productActions'
import { PRODUCT_DETAILS_REQUEST } from '../constants/productConstants'
import Rating from '../components/Rating'

const ProductCarousel = () => {
  const dispatch = useDispatch()

  const topProducts = useSelector((state) => state.topProducts)
  const { loading, error, products } = topProducts

  useEffect(() => {
    dispatch(getTopProducts())
  }, [dispatch])

  const clickProductHandler = () => {
    dispatch({ type: PRODUCT_DETAILS_REQUEST })
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger' message={error} />
  ) : (
    <Carousel pause='hover' className='d-block'>
      {products.map((item) => (
        <Carousel.Item onClick={clickProductHandler}>
          <Link to={`/product/${item._id}`}>
            <Image className='d-block' src={item.image} alt={item.name} fluid />
            <Carousel.Caption>
              <h3>{item.name}</h3>
              <p>${item.price}</p>
              <Rating value={item.rating} />
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProductCarousel
