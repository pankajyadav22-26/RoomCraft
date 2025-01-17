const router = require('express').Router();
const cartController = require('../controllers/cartController');

router.get('/findCart/:id', cartController.getCart)
router.post('/addToCart', cartController.addTocart)
router.delete('/deleteItem/:cartItemId', cartController.deleteCartItem)
router.post('/decItem', cartController.decrementCartItem)
router.post('/incItem', cartController.incrementCartItem)
router.post('/clearCart/:userId', cartController.clearCart)

module.exports = router