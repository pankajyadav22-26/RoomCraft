const router = require('express').Router()
const ordersController = require('../controllers/ordersController')

router.get('/getorders/:id', ordersController.getUserOrders);
router.post('/createOrder', ordersController.addToOrders)

module.exports = router;