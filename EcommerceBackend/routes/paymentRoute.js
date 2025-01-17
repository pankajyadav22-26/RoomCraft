const router = require('express').Router();
const paymentController = require('../controllers/paymentController')

router.post('/payment-sheet', paymentController.paymentSheetCreater)

module.exports = router