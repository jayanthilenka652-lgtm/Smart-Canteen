import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import FoodCard from '../components/FoodCard';
import Loader from '../components/Loader';
import FoodDetailModal from './FoodDetail';
import { Search, Filter, UtensilsCrossed, AlertTriangle, RefreshCw } from 'lucide-react';

export const Menu = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [foods, setFoods] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedFoodForModal, setSelectedFoodForModal] = useState(null);

  const categories = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Drinks', 'Beverages', 'Combos'];

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory, availableOnly]);

  useEffect(() => {
    let isActive = true;

    api.get('/feedback')
      .then((res) => {
        if (isActive) setFeedbacks(res.data || []);
      })
      .catch((err) => console.error('Food ratings could not be loaded:', err));

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavoriteIds(new Set());
      return;
    }

    api.get('/favorites').then((res) => {
      setFavoriteIds(new Set((res.data || []).map((favorite) => String(favorite.food?._id || favorite.food))));
    }).catch((err) => console.error('Favorites could not be loaded:', err));
  }, [isAuthenticated]);

  const fetchFoods = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/foods?';
      if (selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
      if (availableOnly) url += `availableOnly=true&`;
      if (search.trim()) url += `search=${encodeURIComponent(search.trim())}&`;

      const res = await api.get(url);
      if (res.success && res.data) {
        setFoods(res.data);
      } else {
        setError(res.message || 'Could not load menu items from the server.');
      }
    } catch (err) {
      console.error('Menu fetch error:', err);
      setError(err.message || 'Failed to connect to the canteen server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFoods();
  };

  const handleToggleFavorite = async (food) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const res = await api.post(`/favorites/${food._id}`);
      setFavoriteIds((current) => {
        const next = new Set(current);
        if (res.isFavorite) next.add(String(food._id));
        else next.delete(String(food._id));
        return next;
      });
    } catch (err) {
      console.error('Favorite could not be updated:', err);
    }
  };

  const filteredFoods = foods.filter(f => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return f.name.toLowerCase().includes(q)
      || (f.description && f.description.toLowerCase().includes(q))
      || (f.category && f.category.toLowerCase().includes(q));
  });

  const getFoodRating = (food) => {
    const itemReviews = feedbacks.filter((feedback) => (feedback.foodItems || []).some((item) => {
      const reviewedFoodId = item.foodId?._id || item.foodId;
      return String(reviewedFoodId) === String(food._id)
        || item.name?.trim().toLowerCase() === food.name.trim().toLowerCase();
    }));
    const average = itemReviews.length
      ? itemReviews.reduce((total, review) => total + Number(review.rating || 0), 0) / itemReviews.length
      : 0;

    return { average, count: itemReviews.length };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
            <UtensilsCrossed className="w-3.5 h-3.5" /> Fresh Campus Menu
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Pre-Order Your Favorite <span className="gradient-text">Campus Meal</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Browse live availability, filter by category, and reserve your guaranteed pickup slot.
          </p>
        </div>

      </div>

      {/* Search Bar & Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-96 relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search food e.g. Masala Dosa, Biryani..."
            value={search}
            onChange={handleSearchChange}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </form>

        {/* Available Only Toggle */}
        <div className="flex items-center space-x-3 bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-800 self-start md:self-auto">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-slate-300">In Stock Only</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => cat === 'Combos' ? navigate('/combos') : setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'gradient-bg text-white shadow-md shadow-indigo-500/20 scale-105'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="glass-panel p-8 rounded-3xl border border-rose-500/30 bg-rose-500/10 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Unable to Load Food Catalog</h3>
            <p className="text-xs text-rose-300 mt-1 max-w-md mx-auto">{error}</p>
          </div>
          <button
            onClick={fetchFoods}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold inline-flex items-center gap-2 transition-colors border border-slate-700"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        </div>
      )}

      {/* Food Grid Display */}
      {loading ? (
        <Loader label="Fetching fresh canteen menu from server..." />
      ) : !error && filteredFoods.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl space-y-3">
          <p className="text-xl font-bold text-slate-300">No Food Items Found</p>
          <p className="text-xs text-slate-500">Try adjusting your category filter or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFoods.map((food) => (
            <FoodCard
              key={food._id}
              food={food}
              rating={getFoodRating(food)}
              isFavorite={favoriteIds.has(String(food._id))}
              onToggleFavorite={handleToggleFavorite}
              onQuickView={(f) => setSelectedFoodForModal(f)}
            />
          ))}
        </div>
      )}

      {/* Food Detail Modal */}
      {selectedFoodForModal && (
        <FoodDetailModal
          food={selectedFoodForModal}
          onClose={() => setSelectedFoodForModal(null)}
        />
      )}
    </div>
  );
};

export default Menu;
