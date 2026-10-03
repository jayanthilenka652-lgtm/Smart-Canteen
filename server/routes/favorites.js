const express = require('express');
const router = express.Router();
const { getFavorites, toggleFavorite, removeFavorite } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getFavorites);
router.post('/:foodId', protect, toggleFavorite);
router.delete('/:foodId', protect, removeFavorite);

module.exports = router;
