import React from 'react';
import { Plus, Check, Eye, AlertCircle, Clock, Star, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FoodCard = ({ food, rating = { average: 0, count: 0 }, onQuickView, isFavorite = false, onToggleFavorite }) => {
  const { addToCart, cartItems } = useCart();

  const itemInCart = cartItems.find(i => i._id === food._id || i.foodId === food._id);
  const cartQty = itemInCart ? itemInCart.quantity : 0;

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group">
      {/* Image & Badges */}
      <div className="relative h-48 overflow-hidden bg-slate-800">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase bg-slate-900/80 backdrop-blur-md text-indigo-300 rounded-full border border-indigo-500/30">
          {food.category}
        </span>

        {/* Availability Badge */}
        {!food.isAvailable && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center">
            <span className="px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs uppercase tracking-wider border border-rose-500/40 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Sold Out
            </span>
          </div>
        )}

        {/* Quick View Icon */}
        {onQuickView && (
          <button
            onClick={() => onQuickView(food)}
            className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/70 text-slate-300 hover:text-white hover:bg-indigo-600 transition-colors backdrop-blur-md opacity-0 group-hover:opacity-100"
            title="Quick View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
              {food.name}
            </h3>
            {onToggleFavorite && (
              <button
                type="button"
                onClick={() => onToggleFavorite(food)}
                aria-label={isFavorite ? `Remove ${food.name} from favorites` : `Add ${food.name} to favorites`}
                aria-pressed={isFavorite}
                className={`p-1 transition-colors ${isFavorite ? 'text-rose-400' : 'text-slate-500 hover:text-rose-400'}`}
                title={isFavorite ? 'Remove favorite' : 'Add favorite'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {food.description}
          </p>

          {/* Preparation Time & Rating */}
          <div className="flex items-center gap-2 pt-2.5 text-[11px] text-slate-400 font-medium">
            {food.preparationTime && (
              <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-md text-slate-300 border border-slate-700/50">
                <Clock className="w-3 h-3 text-indigo-400" /> {food.preparationTime}
              </span>
            )}
            <span
              className="flex items-center gap-1 bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/20"
              aria-label={`${rating.average.toFixed(1)} out of 5 from ${rating.count} reviews`}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${rating.count && star <= Math.round(rating.average) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                />
              ))}
              {rating.average.toFixed(1)} / 5
              <span className="text-slate-500">({rating.count})</span>
            </span>
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <span className="text-xl font-extrabold text-white">
              ₹{food.price}
            </span>
          </div>

          <button
            onClick={() => food.isAvailable && addToCart(food)}
            disabled={!food.isAvailable}
            className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md ${
              !food.isAvailable
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : cartQty > 0
                ? 'bg-indigo-600 text-white shadow-indigo-500/25 hover:bg-indigo-500'
                : 'gradient-bg text-white shadow-indigo-500/20 hover:scale-[1.02]'
            }`}
          >
            {cartQty > 0 ? (
              <>
                <Check className="w-4 h-4" /> Added ({cartQty})
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
