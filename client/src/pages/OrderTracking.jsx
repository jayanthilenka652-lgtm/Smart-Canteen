import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import OrderStatusBadge from '../components/OrderStatusBadge';
import Loader from '../components/Loader';
import { 
  Clock, 
  CheckCircle2, 
  CookingPot, 
  PackageCheck, 
  RefreshCw, 
  Star, 
  ArrowLeft,
  ShoppingBag,
  AlertCircle
} from 'lucide-react';

export const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.success && res.data) {
        setOrder(res.data);
      }
    } catch (err) {
      setError(err.message || 'Could not fetch order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Auto polling every 5 seconds for live status simulation
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) return <Loader label="Connecting to live canteen queue tracking..." />;

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-2xl font-bold text-white">Order Not Found</h2>
        <p className="text-slate-400 text-sm">{error || 'The requested order details are unavailable.'}</p>
        <Link to="/orders" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs">
          <ArrowLeft className="w-4 h-4" /> Back to My Orders
        </Link>
      </div>
    );
  }

  const steps = [
    { key: 'Pending', label: 'Order Placed', desc: 'Received by Canteen', icon: Clock },
    { key: 'Accepted', label: 'Order Confirmed', desc: 'Order approved by staff', icon: CheckCircle2 },
    { key: 'Preparing', label: 'Preparing', desc: 'Chef is cooking your meal', icon: CookingPot },
    { key: 'Ready', label: 'Ready for Pickup', desc: 'Collect at Counter with Order ID', icon: PackageCheck },
    { key: 'Collected', label: 'Food Collected', desc: 'Enjoy your food!', icon: CheckCircle2 }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Accepted': return 1;
      case 'Preparing': return 2;
      case 'Ready': return 3;
      case 'Collected': return 4;
      default: return -1;
    }
  };

  const currentIndex = getStepIndex(order.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <Link to="/orders" className="text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-semibold">
          <ArrowLeft className="w-4 h-4" /> My Orders
        </Link>
        <button
          onClick={fetchOrder}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1 font-medium"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Live Poll Syncing
        </button>
      </div>

      {/* Main Status Panel */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Tracking Order ID</span>
            <h1 className="text-3xl font-extrabold text-indigo-400 tracking-wider">
              {order.orderId}
            </h1>
          </div>
          <div>
            <OrderStatusBadge status={order.orderStatus} />
          </div>
        </div>

        {/* Status Pipeline Step Progress */}
        {order.orderStatus === 'Rejected' ? (
          <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-2">
            <h3 className="text-lg font-bold text-rose-400">Order Was Rejected</h3>
            <p className="text-xs text-slate-300">
              Canteen staff were unable to fulfill this order. If paid online, refund will be processed automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative">
              <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0"></div>
              
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx <= currentIndex;
                  const isCurrent = idx === currentIndex;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center space-y-2">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                          isCurrent
                            ? 'gradient-bg text-white shadow-lg shadow-indigo-500/30 scale-110 ring-4 ring-indigo-500/30'
                            : isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-slate-900 text-slate-600 border border-slate-800'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div>
                        <span className={`text-xs font-bold block ${isCompleted ? 'text-white' : 'text-slate-500'}`}>
                          {step.label}
                        </span>
                        <span className="text-[10px] text-slate-400 block hidden sm:block max-w-[100px] mx-auto mt-0.5">
                          {step.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Pickup Details & Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Pickup Time Window</span>
            <span className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-1">
              <Clock className="w-4 h-4 text-indigo-400" />
              {order.pickupSlotDetails?.startTime} - {order.pickupSlotDetails?.endTime}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Payment Information</span>
            <span className="text-sm font-bold text-slate-200 mt-1 block">
              {order.paymentMethod} • <span className={order.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}>{order.paymentStatus}</span>
            </span>
          </div>
        </div>

        {order.orderStatus === 'Collected' && (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div>
                <span className="font-bold text-emerald-300 text-sm block">Food Collected Successfully!</span>
                <span className="text-xs text-slate-300">Your order is complete. Please rate your experience and share feedback.</span>
              </div>
            </div>

            <Link
              to={`/feedback?orderId=${order.orderId}`}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Star className="w-4 h-4 fill-slate-950" /> Rate Your Experience
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
