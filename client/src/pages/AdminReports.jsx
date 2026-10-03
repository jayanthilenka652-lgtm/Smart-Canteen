import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';
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
  LineChart, 
  Line 
} from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Clock, Download, RefreshCw } from 'lucide-react';

export const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
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

  if (loading) return <Loader label="Generating sales reports & analytics..." />;

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Sales & Order Reports</h1>
          <p className="text-xs text-slate-400">Comprehensive order counts, revenue trends & food demand breakdown</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" /> Sync Data
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total Collected Revenue</span>
          <div className="text-3xl font-extrabold text-emerald-400">
            ₹{stats?.summary?.totalRevenue || 0}
          </div>
          <span className="text-[11px] text-slate-400 block">Calculated from confirmed transactions</span>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Total Completed Orders</span>
          <div className="text-3xl font-extrabold text-indigo-400">
            {stats?.summary?.totalOrders || 0}
          </div>
          <span className="text-[11px] text-slate-400 block">Orders processed through system</span>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-2 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Active Menu Offerings</span>
          <div className="text-3xl font-extrabold text-purple-400">
            {stats?.summary?.totalFoods || 0}
          </div>
          <span className="text-[11px] text-slate-400 block">Items across 6 food categories</span>
        </div>
      </div>

      {/* Recharts Graphical Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales by Category Pie Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" /> Category Revenue Share
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.categorySalesChart || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="sales"
                  nameKey="category"
                  label={({ category }) => category}
                >
                  {(stats?.categorySalesChart || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hourly Revenue Line Chart */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Hourly Sales Revenue (₹)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.hourlyDistribution || []}>
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Line type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
