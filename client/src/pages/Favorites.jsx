import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import api from '../services/api';
import FoodCard from '../components/FoodCard';
import Loader from '../components/Loader';

const favoriteFood = (favorite) => {
  if (favorite.food && typeof favorite.food === 'object') return favorite.food;
  return {
    _id: favorite.food,
    name: favorite.foodName,
    category: favorite.category,
    price: favorite.price,
    image: favorite.image,
    isAvailable: favorite.isAvailable !== false
  };
};

export const Favorites = () => {
  const [foods, setFoods] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/favorites')
      .then((res) => setFoods((res.data || []).map(favoriteFood)))
      .catch((err) => setError(err.message || 'Favorites could not be loaded.'))
      .finally(() => setLoading(false));

    api.get('/feedback')
      .then((res) => setFeedbacks(res.data || []))
      .catch((err) => console.error('Food ratings could not be loaded:', err));
  }, []);

  const getFoodRating = (food) => {
    const itemReviews = feedbacks.filter((feedback) => (feedback.foodItems || []).some((item) => {
      const reviewedFoodId = item.foodId?._id || item.foodId;
      return String(reviewedFoodId) === String(food._id)
        || item.name?.trim().toLowerCase() === food.name?.trim().toLowerCase();
    }));
    const average = itemReviews.length
      ? itemReviews.reduce((total, review) => total + Number(review.rating || 0), 0) / itemReviews.length
      : 0;

    return { average, count: itemReviews.length };
  };

  const removeFavorite = async (food) => {
    try {
      await api.delete(`/favorites/${food._id}`);
      setFoods((current) => current.filter((item) => String(item._id) !== String(food._id)));
    } catch (err) {
      setError(err.message || 'Favorite could not be removed.');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <header className="flex items-center gap-3">
        <Heart className="w-6 h-6 text-rose-400 fill-current" />
        <div>
          <h1 className="text-2xl font-extrabold text-white">Your Favorites</h1>
          <p className="text-sm text-slate-400">Saved foods from the current menu</p>
        </div>
      </header>

      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      {loading ? <Loader label="Loading your favorites..." /> : foods.length === 0 ? (
        <div className="py-16 text-center border-y border-slate-800">
          <p className="text-lg font-semibold text-slate-200">No favorites saved yet</p>
          <Link to="/menu" className="inline-block mt-3 text-sm text-indigo-300 hover:text-white">Browse the menu</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {foods.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
              rating={getFoodRating(food)}
              isFavorite
              onToggleFavorite={removeFavorite}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Favorites;