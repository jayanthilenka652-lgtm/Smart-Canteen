import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import OrderStatusBadge from '../components/OrderStatusBadge';
import Loader from '../components/Loader';
import { Package, Clock, ArrowRight, Star, RefreshCw } from 'lucide-react';

export const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders/my-orders');
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader label="Loading your order history..." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">My Orders & Live Tracking</h1>
          <p className="text-xs text-slate-400">View real-time progress and past order records</p>
        </div>
        <button
          onClick={fetchMyOrders}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl space-y-4">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't placed any food pre-orders yet. Visit the menu to order your meal!
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white gradient-bg"
          >
            Explore Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id || order.orderId}
              className="glass-card p-6 rounded-3xl space-y-4 border border-slate-800"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs text-slate-400">Order Reference</span>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-extrabold text-indigo-400">{order.orderId}</span>
                    <OrderStatusBadge status={order.orderStatus} />
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-400">Placed On</span>
                  <span className="text-xs text-slate-200 block font-medium">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Slot & Payment Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Pickup Slot</span>
                  <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    {order.pickupSlotDetails?.startTime} - {order.pickupSlotDetails?.endTime}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Payment Details</span>
                  <span className="font-bold text-slate-200 mt-0.5 block">
                    {order.paymentMethod} • <span className={order.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}>{order.paymentStatus}</span>
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Total Price</span>
                  <span className="font-extrabold text-indigo-300 text-sm mt-0.5 block">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400">
                  {order.items?.length || 1} Item(s)
                </span>

                <div className="flex items-center gap-2">
                  {order.orderStatus === 'Collected' && (
                    <Link
                      to={`/feedback?orderId=${order.orderId}`}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 flex items-center gap-1.5"
                    >
                      <Star className="w-3.5 h-3.5" /> Rate & Review
                    </Link>
                  )}

                  <Link
                    to={`/order-tracking/${order.orderId || order._id}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white gradient-bg hover:scale-105 transition-transform flex items-center gap-1.5"
                  >
                    Track Progress <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
