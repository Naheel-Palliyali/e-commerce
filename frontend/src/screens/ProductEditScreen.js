import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Col, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { listProductDetail, updateProduct } from '../actions/productActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

const ProductEditScreen = () => {
  const id = useParams().id
  const navigate = useNavigate()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo, error, loading } = userLogin

  const productDetails = useSelector((state) => state.productDetails)
  const {
    product,
    error: errorProduct,
    loading: loadingProduct,
  } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    product: editedProduct,
    loading: loadingProductEdit,
    error: errorProductEdit,
    success: successProductEdit,
  } = productUpdate

  const [name, setName] = useState()
  const [image, setImage] = useState()
  const [brand, setBrand] = useState()
  const [category, setCategory] = useState()
  const [description, setDescription] = useState()
  const [price, setPrice] = useState()
  const [countInStock, setCountInStock] = useState()
  const [uploading, setUploading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch({ type: PRODUCT_UPDATE_RESET })
    if (successProductEdit) {
      navigate('/api/admin/products')
    } else {
      if (!product.name || product._id !== id) {
        dispatch(listProductDetail(id))
      } else {
        setName(product.name)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setDescription(product.description)
        setPrice(product.price)
        setCountInStock(product.countInStock)
      }
    }
  }, [dispatch, navigate, product, successProductEdit, id])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    console.log(file)
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
      const { data } = await axios.post('/api/upload', formData, config)
      setImage(data)
      setUploading(false)
    } catch (error) {
      console.log(error)
      setUploading(false)
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      updateProduct({
        _id: id,
        name,
        image,
        price,
        brand,
        category,
        description,
        countInStock,
      })
    )
  }

  return (
    <>
      <Link to='/api/admin/products'>
        <Button
          variant='outline-secondary'
          size='sm'
          style={{ padding: '4px 8px', borderColor: 'white' }}
        >
          Go back
        </Button>
      </Link>
      <h1>Edit Product</h1>
      {error && <Message variant='danger' message={error} />}
      {errorProduct && <Message variant='danger' message={errorProduct} />}
      {errorProductEdit && (
        <Message variant='danger' message={errorProductEdit} />
      )}
      {loading || loadingProduct || loadingProductEdit ? (
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
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='name'
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image path'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <Form.Control
                type='file'
                required
                name='file'
                onChange={uploadFileHandler}
              />
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group className='mb-3' controlId='formBasicEmail'>
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter stock'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
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

export default ProductEditScreen
