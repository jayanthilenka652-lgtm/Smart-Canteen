import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BadgePercent, ShoppingBag, Tags } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';
import { useCart } from '../context/CartContext';

export const Combos = () => {
  const { addComboToCart } = useCart();
  const [combos, setCombos] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/combos'), api.get('/foods')])
      .then(([comboResponse, foodResponse]) => {
        setCombos(comboResponse.data || []);
        setFoods(foodResponse.data || []);
      })
      .catch((err) => setError(err.message || 'Combo offers could not be loaded.'))
      .finally(() => setLoading(false));
  }, []);

  const foodByName = new Map(foods.map((food) => [food.name.toLowerCase(), food]));

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-300 text-sm font-semibold"><Tags className="w-4 h-4" /> Campus offers</div>
          <h1 className="mt-2 text-3xl font-extrabold text-white">Combo Offers</h1>
          <p className="mt-1 text-sm text-slate-400">Student-friendly bundles, prepared for your selected pickup slot.</p>
        </div>
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-white">
          View cart <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      {loading ? <Loader label="Loading combo offers..." /> : combos.length === 0 ? (
        <div className="py-16 text-center border-y border-slate-800 text-slate-300">No combo offers are available right now.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {combos.map((combo) => {
            const components = (combo.items || []).map((item) => ({
              ...item,
              food: foodByName.get(item.name.toLowerCase())
            }));
            const originalPrice = components.reduce((sum, item) => sum + (item.food?.price || 0) * item.quantity, 0);
            const available = combo.isAvailable && components.length > 0 && components.every((item) => item.food?.isAvailable);

            return (
              <article key={combo._id} className="overflow-hidden border border-slate-800 bg-slate-900/70 rounded-xl">
                <div className="aspect-[16/10] bg-slate-800">
                  <img src={combo.image} alt={combo.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-white">{combo.name}</h2>
                      <p className="mt-1 text-sm text-slate-400">{combo.description}</p>
                    </div>
                    <span className={`shrink-0 text-xs font-semibold ${available ? 'text-emerald-300' : 'text-rose-300'}`}>
                      {available ? 'Available' : 'Sold Out'}
                    </span>
                  </div>
                  <ul className="space-y-1 text-sm text-slate-300">
                    {components.map((item) => (
                      <li key={item.name} className="flex justify-between gap-3">
                        <span>{item.name} × {item.quantity}</span>
                        {!item.food?.isAvailable && <span className="text-rose-300">Unavailable</span>}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-end justify-between border-t border-slate-800 pt-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-extrabold text-white">₹{combo.price}</span>
                        {originalPrice > combo.price && <span className="text-xs text-slate-500 line-through">₹{originalPrice}</span>}
                      </div>
                      {originalPrice > combo.price && (
                        <span className="mt-1 flex items-center gap-1 text-xs text-emerald-300"><BadgePercent className="w-3.5 h-3.5" /> Save ₹{originalPrice - combo.price}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      disabled={!available}
                      onClick={() => addComboToCart(combo)}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Combos;