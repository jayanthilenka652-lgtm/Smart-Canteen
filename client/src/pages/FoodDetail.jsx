import React, { useEffect, useState } from 'react';
import { X, Plus, Minus, ShoppingCart, Clock, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../services/api';

export const FoodDetailModal = ({ food, onClose }) => {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [feedbacks, setFeedbacks] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState('');

  useEffect(() => {
    let isActive = true;

    api.get('/feedback')
      .then((res) => {
        if (isActive) {
          setFeedbacks(res.data || []);
          setReviewsError('');
        }
      })
      .catch((error) => {
        console.error('Food reviews could not be loaded:', error);
        if (isActive) setReviewsError('Reviews could not be loaded. Please try again later.');
      })
      .finally(() => {
        if (isActive) setReviewsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [food?._id]);

  if (!food) return null;

  const reviews = feedbacks.filter((feedback) => (feedback.foodItems || []).some((item) => {
    const reviewedFoodId = item.foodId?._id || item.foodId;
    return String(reviewedFoodId) === String(food._id)
      || item.name?.trim().toLowerCase() === food.name.trim().toLowerCase();
  }));
  const averageRating = reviews.length
    ? reviews.reduce((total, review) => total + Number(review.rating || 0), 0) / reviews.length
    : 0;

  const handleAdd = () => {
    addToCart(food, qty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-700 shadow-2xl space-y-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-900/80 text-slate-300 hover:text-white backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-60 bg-slate-800 overflow-hidden">
          <img
            src={food.image}
            alt={food.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
          <span className="absolute bottom-4 left-6 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider gradient-bg text-white">
            {food.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 pt-0 space-y-4">
          <div>
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-extrabold text-white">{food.name}</h2>
            </div>
            {food.preparationTime && (
              <span className="inline-flex items-center gap-1.5 text-xs text-indigo-300 mt-1 font-semibold">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Prep Time: {food.preparationTime}
              </span>
            )}
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">{food.description}</p>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Unit Price</span>
              <span className="text-2xl font-extrabold text-white">₹{food.price}</span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-3 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 rounded-lg bg-slate-700 text-slate-200 flex items-center justify-center font-bold hover:bg-slate-600"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-extrabold text-white px-2">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="w-8 h-8 rounded-lg bg-slate-700 text-slate-200 flex items-center justify-center font-bold hover:bg-slate-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <section className="space-y-3" aria-label={`${food.name} ratings and reviews`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white">Ratings & Reviews</h3>
              <span className="flex items-center gap-1 text-xs text-amber-300" aria-label={`${averageRating.toFixed(1)} out of 5 from ${reviews.length} reviews`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${reviews.length && star <= Math.round(averageRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                  />
                ))}
                {averageRating.toFixed(1)} / 5
                <span className="text-slate-500">({reviews.length})</span>
              </span>
            </div>

            {reviewsLoading ? (
              <p className="text-xs text-slate-400">Loading reviews...</p>
            ) : reviewsError ? (
              <p role="alert" className="text-xs text-rose-300">{reviewsError}</p>
            ) : reviews.length === 0 ? (
              <p className="text-xs text-slate-400">No reviews for this item yet.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {reviews.map((review) => (
                  <article key={review._id} className="rounded-xl bg-slate-900/70 border border-slate-800 p-3 space-y-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-white">{review.userName || review.user?.name || 'Student'}</span>
                      <span className="flex items-center gap-1 text-xs text-amber-300">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                        ))}
                        {review.rating} / 5
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-300">{review.comment}</p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <div className="pt-2">
            <button
              onClick={handleAdd}
              disabled={!food.isAvailable}
              className={`w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg ${
                food.isAvailable
                  ? 'gradient-bg shadow-indigo-500/30 hover:scale-[1.01]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-5 h-5" /> Add {qty} to Cart • ₹{food.price * qty}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailModal;
