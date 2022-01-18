import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Button } from 'react-bootstrap'
import Product from '../components/Product'
import { listProduct } from '../actions/productActions'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useParams, Link } from 'react-router-dom'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'

const HomeScreen = () => {
  const disptach = useDispatch()
  const keyword = useParams().keyword
  const pageNumber = useParams().pageNumber
  console.log(keyword)
  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  useEffect(() => {
    disptach(listProduct(keyword, pageNumber))
  }, [disptach, keyword, pageNumber])

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
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
      )}
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger' message={error} />
      ) : (
        <>
          <Meta />
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            keyword={keyword ? keyword : ''}
            page={page}
            pages={pages}
          />
        </>
      )}
    </>
  )
}

export default HomeScreen
