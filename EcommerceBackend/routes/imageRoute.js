const router = require('express').Router();
const imageController = require('../controllers/imageSearchController');

router.post('/imageSearch', imageController.labelDetectionController);

module.exports = router;