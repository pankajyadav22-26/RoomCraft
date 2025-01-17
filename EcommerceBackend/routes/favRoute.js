const router = require('express').Router();
const favoriteController = require('../controllers/favouriteController');

router.post('/add', favoriteController.addToFavorites);
router.get('/get/:userId', favoriteController.getUserFavorites);
router.post('/remove', favoriteController.removeFromFavorites);

module.exports = router;