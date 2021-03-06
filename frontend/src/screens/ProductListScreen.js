import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Table, Row, Col } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import {
    listProduct,
    deleteProduct,
    createProduct,
} from '../actions/productActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    PRODUCT_CREATE_RESET,
    PRODUCT_DETAILS_RESET,
} from '../constants/productConstants'
import Paginate from '../components/Paginate'

library.add(faPlus)
const plus = <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} />

const ProductListScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const pageNumber = useParams().pageNumber

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const productCreate = useSelector((state) => state.productCreate)
    const {
        loading: loadingCreate,
        success: successCreate,
        error: errorCreate,
        product: productCreated,
    } = productCreate

    const productDelete = useSelector((state) => state.productDelete)
    const {
        loading: loadingDelete,
        success: successDelete,
        error: errorDelete,
    } = productDelete

    useEffect(() => {
        dispatch({ type: PRODUCT_DETAILS_RESET })
        dispatch({ type: PRODUCT_CREATE_RESET })
        if (!userInfo || !userInfo.isAdmin) {
            navigate('/login')
        } else if (successCreate) {
            navigate(`/api/admin/products/${productCreated._id}/edit`)
        } else {
            dispatch(listProduct('', pageNumber))
        }
    }, [
        dispatch,
        userInfo,
        navigate,
        successDelete,
        successCreate,
        productCreated,
        pageNumber,
    ])

    const productList = useSelector((state) => state.productList)
    const { loading, products, error, page, pages } = productList

    const deleteProductHandler = (id) => {
        if (window.confirm('Are you sure?')) {
            dispatch(deleteProduct(id))
        }
    }

    const editProductHandler = (id) => {
        navigate(`/api/admin/products/${id}/edit`)
    }

    const createProductHandler = () => {
        dispatch(createProduct())
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
                        style={{
                            position: 'absolute',
                            right: '12px',
                            top: '12px',
                        }}
                        onClick={createProductHandler}
                    >
                        {plus}
                        Create product
                    </Button>
                </Col>
            </Row>
            {errorDelete && (
                <Message
                    variant='danger'
                    message={`Deleting product failed: ${errorDelete}`}
                />
            )}
            {errorCreate && (
                <Message
                    variant='danger'
                    message={`Creating product failed: ${errorCreate}`}
                />
            )}
            {loading || loadingDelete || loadingCreate ? (
                <Loader />
            ) : error ? (
                <Message message={error} variant='danger' />
            ) : (
                <>
                    <Table striped responsive bordered hover size='sm'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Stock</th>
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
                                        <td>${product.price}</td>
                                        <td>{product.countInStock}</td>
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
                                                    marginRight: '12px',
                                                }}
                                                onClick={() =>
                                                    editProductHandler(
                                                        product._id
                                                    )
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
                                                    deleteProductHandler(
                                                        product._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                    <Paginate page={page} pages={pages} isAdmin={true} />
                </>
            )}
        </>
    )
}

export default ProductListScreen
