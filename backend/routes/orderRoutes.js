import express from 'express'
const router = express.Router()
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
} from '../controllers/orderController.js'
import protect from '../middleware/authMiddleware.js'

router.route('/').post(protect, addOrderItems)
router.route('/myorders').get(protect, getMyOrders)
router.route('/order/:id').get(protect, getOrderById)
router.route('/order/:id/pay').put(protect, updateOrderToPaid)

export default router
