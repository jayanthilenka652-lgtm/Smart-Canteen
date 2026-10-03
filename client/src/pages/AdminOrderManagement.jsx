import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { 
  Clock, 
  CheckCircle2, 
  CookingPot, 
  PackageCheck, 
  XCircle, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

export const AdminOrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');

  const statusFilters = ['All', 'Pending', 'Accepted', 'Preparing', 'Ready', 'Collected', 'Rejected'];

  useEffect(() => {
    fetchOrders();
    // Live polling for admin queue
    const interval = setInterval(fetchOrders, 4000);
    return () => clearInterval(interval);
  }, [selectedStatus]);

  const fetchOrders = async () => {
    try {
      let url = '/orders?';
      if (selectedStatus !== 'All') url += `status=${encodeURIComponent(selectedStatus)}`;

      const res = await api.get(url);
      if (res.success && res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Live Orders Approval Queue</h1>
          <p className="text-xs text-slate-400">Accept incoming orders, update kitchen cooking state, and confirm collection</p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" /> Live Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {statusFilters.map((st) => (
          <button
            key={st}
            onClick={() => setSelectedStatus(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedStatus === st
                ? 'gradient-bg text-white shadow-md shadow-indigo-500/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders Queue List */}
      {loading ? (
        <Loader label="Syncing incoming orders..." />
      ) : orders.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl text-slate-400 text-sm">
          No orders found under "{selectedStatus}" status filter.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id || order.orderId}
              className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-extrabold text-indigo-400">{order.orderId}</span>
                    <OrderStatusBadge status={order.orderStatus} />
                  </div>
                  <span className="text-xs text-slate-400">
                    Student: <span className="text-white font-semibold">{order.user?.name || 'Student'}</span> • {new Date(order.createdAt).toLocaleTimeString()}
                  </span>
                </div>

                <div className="text-left md:text-right">
                  <span className="text-xs text-slate-400 block font-medium">Pickup Slot Window</span>
                  <span className="text-sm font-extrabold text-white flex items-center gap-1 md:justify-end">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    {order.pickupSlotDetails?.startTime} - {order.pickupSlotDetails?.endTime}
                  </span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                  <span className="font-bold text-slate-300 block">Ordered Food Items:</span>
                  <div className="space-y-1">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-slate-300">
                        <span>• {item.name} × {item.quantity}</span>
                        <span className="font-semibold text-white">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                  <span className="font-bold text-slate-300 block">Payment & Bill:</span>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Method</span>
                    <span className="font-semibold text-white">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment Status</span>
                    <span className={order.paymentStatus === 'Paid' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between font-extrabold text-sm text-white pt-2 border-t border-slate-800">
                    <span>Total Amount</span>
                    <span className="text-indigo-400">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                {order.orderStatus === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'Accepted')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-500 text-white hover:bg-blue-600 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Accept Order
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(order._id, 'Rejected')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </>
                )}

                {order.orderStatus === 'Accepted' && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, 'Preparing')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 flex items-center gap-1.5"
                  >
                    <CookingPot className="w-3.5 h-3.5" /> Start Cooking
                  </button>
                )}

                {order.orderStatus === 'Preparing' && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, 'Ready')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 flex items-center gap-1.5 animate-pulse"
                  >
                    <PackageCheck className="w-3.5 h-3.5" /> Mark Ready for Pickup
                  </button>
                )}

                {order.orderStatus === 'Ready' && (
                  <button
                    onClick={() => handleUpdateStatus(order._id, 'Collected')}
                    className="px-4 py-2 rounded-xl text-xs font-bold gradient-bg text-white hover:scale-105 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Collected
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagement;
