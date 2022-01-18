import express from 'express'
import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc    Fetch all products
// @route   GET /api/products
// @access  public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await Product.countDocuments({ ...keyword })

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get top products
// @route   GET /api/products/top
// @access  public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .sort({ rating: -1 })
    .limit(5)
    .select('image name price rating')
  res.json(products)
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    delete product
// @route   DELETE /api/products/:id
// @access  private/admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.remove()
    res.json({ message: 'Product deleted' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    add product review
// @route   POST /api/products/:id/reviews
// @access  private
const createReview = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  const { rating, comment } = req.body

  if (product) {
    const alreadyReviewed = await product.review.find(
      (review) => review.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment: String(comment),
      user: req.user._id,
    }

    product.review.push(review)
    product.numReviews = product.review.length
    product.rating =
      product.review.reduce((acc, item) => item.rating + acc, 0) /
      product.review.length

    await product.save()

    res.status(200).json({ message: 'Product review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    create product
// @route   POST /api/products
// @access  private/admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    user: req.user._id,
    name: 'Sample product',
    image: '/images/sample.jpg',
    brand: 'sample brand',
    category: 'sample category',
    description: 'sample description',
    numReviews: 0,
    price: 0,
    countInStock: 0,
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc    update product
// @route   PUT /api/products/id
// @access  private/admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    const updatedProduct = await product.save()
    res.status(201).json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

export {
  getProductById,
  getProducts,
  getTopProducts,
  deleteProduct,
  createProduct,
  updateProduct,
  createReview,
}
