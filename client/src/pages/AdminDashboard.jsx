import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import OrderStatusBadge from '../components/OrderStatusBadge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  UtensilsCrossed, 
  Star, 
  Users, 
  TrendingUp, 
  ArrowRight,
  Layers,
  CheckCircle2
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/dashboard');
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader label="Loading administrative analytics..." />;

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

  const statusData = stats?.statusCounts ? [
    { name: 'Pending', value: stats.statusCounts.Pending },
    { name: 'Accepted', value: stats.statusCounts.Accepted },
    { name: 'Preparing', value: stats.statusCounts.Preparing },
    { name: 'Ready', value: stats.statusCounts.Ready },
    { name: 'Collected', value: stats.statusCounts.Collected },
    { name: 'Rejected', value: stats.statusCounts.Rejected }
  ].filter(d => d.value > 0) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Quick Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-500/20">
            Admin Operations Center
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Canteen Dashboard</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/food"
            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5"
          >
            <UtensilsCrossed className="w-4 h-4 text-indigo-400" /> Manage Menu
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white gradient-bg flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
          >
            <Clock className="w-4 h-4" /> Live Orders Queue
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Today's Orders</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {stats?.summary?.todayOrders || 0}
          </div>
          <span className="text-[11px] text-indigo-400 font-semibold">Live queue today</span>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Pending Orders</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {stats?.summary?.pendingOrders || 0}
          </div>
          <span className="text-[11px] text-amber-400 font-semibold">Awaiting action</span>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Preparing / Ready</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {(stats?.summary?.preparingOrders || 0) + (stats?.summary?.readyOrders || 0)}
          </div>
          <span className="text-[11px] text-purple-400 font-semibold">Kitchen active</span>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Today's Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            ₹{stats?.summary?.todayRevenue || 0}
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {stats?.summary?.completedOrders || 0} completed
          </span>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Available Food Items</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {stats?.summary?.availableFoodItems || 0}
          </div>
          <span className="text-[11px] text-slate-400">Ready for students</span>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Sold-Out Food Items</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {stats?.summary?.soldOutFoodItems || 0}
          </div>
          <span className="text-[11px] text-rose-400 font-semibold">Needs replenishment</span>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Completed Orders</span>
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {stats?.summary?.completedOrders || 0}
          </div>
          <span className="text-[11px] text-teal-400 font-semibold">Picked up by students</span>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Avg Student Rating</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">
            {stats?.summary?.avgRating || '4.9'} ★
          </div>
          <span className="text-[11px] text-amber-400 font-semibold">High student satisfaction</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Sales Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" /> Revenue by Food Category (₹)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.categorySalesChart || []}>
                <XAxis dataKey="category" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="sales" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Distribution Area Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-400" /> Peak Hour Order Traffic
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.hourlyDistribution || []}>
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="orders" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Most Ordered Items */}
      {stats?.summary?.mostOrderedItems && stats.summary.mostOrderedItems.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" /> Most Ordered Items
            </h3>
          </div>
          <div className="space-y-3">
            {stats.summary.mostOrderedItems.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between bg-slate-900/60 px-4 py-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-400 text-xs font-bold flex items-center justify-center">#{index + 1}</span>
                  <span className="text-white font-semibold text-sm">{item.name}</span>
                </div>
                <span className="text-indigo-300 font-bold text-xs">{item.count} orders</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Incoming Orders Queue */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Recent Incoming Orders
          </h3>
          <Link to="/admin/orders" className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1">
            View All Queue <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No recent orders recorded.</p>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {stats.recentOrders.map((ord) => (
              <div key={ord._id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <span className="font-extrabold text-indigo-400 text-sm">{ord.orderId}</span>
                  <span className="text-slate-400 block">
                    {ord.items?.length || 1} items • ₹{ord.totalAmount}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-300 font-medium">
                    {ord.pickupSlotDetails?.startTime} - {ord.pickupSlotDetails?.endTime}
                  </span>
                  <OrderStatusBadge status={ord.orderStatus} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
