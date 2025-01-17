const router = require('express').Router();
const productController = require('../controllers/productsController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/allProducts', productController.getAllProducts)
router.get('/newProducts', productController.getNewArrivals)
router.get('/topProducts', productController.getTopProducts)
router.get('/:id', productController.getProduct)
router.get('/search/:key', productController.searchProduct)
router.post('/create', productController.createProduct)

module.exports = router