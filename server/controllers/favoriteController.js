const Favorite = require('../models/Favorite');
const Food = require('../models/Food');
const { isFallback, store } = require('../config/db');

const getFavorites = async (req, res) => {
  try {
    if (isFallback()) {
      const list = store.favorites
        .filter((fav) => fav.user === req.user._id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((fav) => ({
          ...fav,
          food: store.foods.find((food) => food._id === fav.food) || null
        }));
      return res.json({ success: true, count: list.length, data: list });
    }

    const favorites = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 }).populate('food');
    res.json({ success: true, count: favorites.length, data: favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleFavorite = async (req, res) => {
  const { foodId } = req.params;

  try {
    if (isFallback()) {
      const food = store.foods.find((f) => f._id === foodId || f._id === foodId);
      if (!food) return res.status(404).json({ success: false, message: 'Food item not found' });

      const existing = store.favorites.find((fav) => fav.user === req.user._id && (fav.food === foodId || fav.food === foodId));
      if (existing) {
        store.favorites = store.favorites.filter((fav) => !(fav.user === req.user._id && (fav.food === foodId || fav.food === foodId)));
        return res.json({ success: true, isFavorite: false, message: 'Removed from favourites' });
      }

      const fav = {
        _id: 'favorite_' + Date.now(),
        user: req.user._id,
        food: food._id,
        foodName: food.name,
        category: food.category,
        price: food.price,
        image: food.image,
        createdAt: new Date()
      };

      store.favorites.unshift(fav);
      return res.status(201).json({ success: true, isFavorite: true, message: 'Added to favourites', data: fav });
    }

    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ success: false, message: 'Food item not found' });

    const existing = await Favorite.findOne({ user: req.user._id, food: foodId });
    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return res.json({ success: true, isFavorite: false, message: 'Removed from favourites' });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      food: food._id,
      foodName: food.name,
      category: food.category,
      price: food.price,
      image: food.image
    });

    res.status(201).json({ success: true, isFavorite: true, message: 'Added to favourites', data: favorite });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeFavorite = async (req, res) => {
  const { foodId } = req.params;

  try {
    if (isFallback()) {
      const before = store.favorites.length;
      store.favorites = store.favorites.filter((fav) => !(fav.user === req.user._id && fav.food === foodId));
      if (before === store.favorites.length) {
        return res.status(404).json({ success: false, message: 'Favourite not found' });
      }
      return res.json({ success: true, message: 'Favourite removed' });
    }

    const result = await Favorite.deleteOne({ user: req.user._id, food: foodId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Favourite not found' });
    }
    res.json({ success: true, message: 'Favourite removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFavorites,
  toggleFavorite,
  removeFavorite
};
