import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import SlotPicker from '../components/SlotPicker';
import { aiService } from '../services/aiService';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Coins, 
  Sparkles, 
  ShieldAlert, 
  ArrowRight,
  Utensils
} from 'lucide-react';

export const CartCheckout = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, subtotal, selectedSlot, setSelectedSlot } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('Online');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState(null);

  useEffect(() => {
    fetchSlots();
    if (cartItems.length > 0) {
      aiService.suggestSmartCombos(cartItems).then(res => {
        if (res.success) setAiSuggestion(res.data);
      });
    }
  }, [cartItems]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      const res = await api.get('/slots');
      if (res.success && res.data) {
        setSlots(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    if (!selectedSlot) {
      setError('Please select a pickup time slot before proceeding.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        items: cartItems.map(i => i.comboId
          ? { comboId: i.comboId, quantity: i.quantity }
          : { foodId: i._id || i.foodId, quantity: i.quantity }),
        pickupSlotId: selectedSlot._id,
        paymentMethod
      };

      const res = await api.post('/orders', payload);
      if (res.success && res.data) {
        clearCart();
        navigate(`/order-success/${res.data.orderId || res.data._id}`, { state: { order: res.data } });
      }
    } catch (err) {
      setError(err.message || 'Failed to place order. Slot may be full.');
      // Refresh slots in case selected slot filled up
      fetchSlots();
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mx-auto border border-indigo-500/30">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-white">Your Cart is Empty</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Explore our fresh campus food menu, add items to your cart, and pre-order for hassle-free pickup!
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-white gradient-bg shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all"
        >
          <Utensils className="w-4 h-4" /> Browse Campus Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Checkout & Pre-Order</h1>
        <p className="text-xs text-slate-400">Review items, reserve your time slot, and confirm payment</p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cart Items & Slot Selector */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cart Items List */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-400" /> Cart Items ({cartItems.length})
              </h2>
              <button
                onClick={clearCart}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
              >
                Clear Cart
              </button>
            </div>

            <div className="divide-y divide-slate-800/80">
              {cartItems.map((item) => (
                <div key={item._id || item.foodId} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-800"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.name}</h4>
                      <span className="text-xs text-indigo-400 font-semibold">₹{item.price} each</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Qty Controls */}
                    <div className="flex items-center space-x-2 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => updateQuantity(item._id || item.foodId, -1)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-white px-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id || item.foodId, 1)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-extrabold text-white text-sm w-16 text-right">
                      ₹{item.price * item.quantity}
                    </span>

                    <button
                      onClick={() => removeFromCart(item._id || item.foodId)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Complementary Combo Banner */}
          {aiSuggestion && (
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
                <div>
                  <span className="text-xs font-bold text-indigo-300 block">AI Smart Pairing Recommendation</span>
                  <p className="text-xs text-slate-300">{aiSuggestion.reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Slot Selection */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800">
            {loadingSlots ? (
              <p className="text-xs text-slate-400">Loading pickup time slots...</p>
            ) : (
              <SlotPicker
                slots={slots}
                selectedSlot={selectedSlot}
                onSelectSlot={(slot) => setSelectedSlot(slot)}
              />
            )}
          </div>
        </div>

        {/* Right Column: Payment & Order Summary */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3">
              Payment Method
            </h3>

            <div className="space-y-3">
              <label
                onClick={() => setPaymentMethod('Online')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'Online'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-indigo-400" />
                  <div>
                    <span className="font-bold text-sm block text-white">Online Payment</span>
                    <span className="text-[11px] text-slate-400">UPI / Card / Net Banking (Instant)</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Online'}
                  onChange={() => setPaymentMethod('Online')}
                  className="accent-indigo-500"
                />
              </label>

              <label
                onClick={() => setPaymentMethod('Cash')}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'Cash'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="font-bold text-sm block text-white">Cash on Pickup</span>
                    <span className="text-[11px] text-slate-400">Pay cash at counter when collecting</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'Cash'}
                  onChange={() => setPaymentMethod('Cash')}
                  className="accent-indigo-500"
                />
              </label>
            </div>

            {/* Summary Pricing */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Pickup Slot Reservation</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-white font-extrabold text-lg pt-2 border-t border-slate-800">
                <span>Total Amount</span>
                <span className="text-indigo-400">₹{subtotal}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handlePlaceOrder}
              disabled={submitting}
              className="w-full py-4 rounded-2xl font-bold text-sm text-white gradient-bg shadow-lg shadow-indigo-500/25 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                'Processing Order...'
              ) : (
                <>
                  Confirm Pre-Order <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCheckout;
