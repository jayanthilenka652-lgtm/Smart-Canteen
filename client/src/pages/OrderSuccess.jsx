import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, PackageCheck, ArrowRight, Home } from 'lucide-react';

export const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
        <CheckCircle2 className="w-10 h-10 animate-bounce" />
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
          Order Confirmed
        </span>
        <h1 className="text-3xl font-extrabold text-white">Pre-Order Placed Successfully!</h1>
        <p className="text-sm text-slate-400">
          Your order has been submitted to the canteen kitchen. Keep your Order ID ready for pickup.
        </p>
      </div>

      {/* Order Summary Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-left space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Order ID</span>
            <span className="text-xl font-extrabold text-indigo-400 tracking-wider">
              {order?.orderId || id}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Payment</span>
            <span className="text-xs font-bold text-emerald-400 uppercase">
              {order?.paymentMethod || 'Online'} • {order?.paymentStatus || 'Paid'}
            </span>
          </div>
        </div>

        {/* Pickup Time Slot */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-indigo-400" />
            <div>
              <span className="text-xs font-bold text-indigo-300 block">Reserved Pickup Slot</span>
              <span className="text-sm font-extrabold text-white">
                {order?.pickupSlotDetails?.startTime || '12:00 PM'} - {order?.pickupSlotDetails?.endTime || '12:15 PM'}
              </span>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
            {order?.pickupSlotDetails?.date || 'Today'}
          </span>
        </div>

        {/* Ordered Items Summary */}
        {order?.items && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-400">Items Ordered:</span>
            <div className="space-y-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-slate-300">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-semibold">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
              <span>Total Paid</span>
              <span className="text-indigo-400">₹{order.totalAmount}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to={`/orders`}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm text-white gradient-bg shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 hover:scale-105 transition-transform"
        >
          <PackageCheck className="w-4 h-4" /> Track Order Status Live <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/menu"
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" /> Return to Menu
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
