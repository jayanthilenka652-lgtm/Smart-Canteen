import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { 
  UtensilsCrossed, 
  ShoppingCart, 
  User, 
  LogOut, 
  LayoutDashboard, 
  Clock, 
  MessageSquare, 
  BarChart3, 
  Layers, 
  Menu as MenuIcon, 
  X,
  Sparkles,
  Search,
  Heart,
  Tags,
  Bell,
  CheckCheck
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.success) {
        setNotifications(res.data || []);
      }
    } catch (err) {
      console.error('Notification fetch failed:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markNotificationRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error('Mark as read failed:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error('Mark all read failed:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block leading-none">
                Smart<span className="gradient-text">Canteen</span>
              </span>
              <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">
                Pre-Order System
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {!isAdmin ? (
              <>
                <Link
                  to="/menu"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/menu') ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <UtensilsCrossed className="w-4 h-4" /> Menu
                  </span>
                </Link>

                <Link
                  to="/combos"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/combos') ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-1.5"><Tags className="w-4 h-4" /> Combos</span>
                </Link>

                {isAuthenticated && (
                  <>
                    <Link
                      to="/favorites"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/favorites') ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="flex items-center gap-1.5"><Heart className="w-4 h-4" /> Favorites</span>
                    </Link>
                    <Link
                      to="/orders"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/orders') ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> My Orders
                      </span>
                    </Link>

                    <Link
                      to="/feedback"
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive('/feedback') ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4" /> Feedback
                      </span>
                    </Link>
                  </>
                )}
              </>
            ) : (
              // Admin Links
              <>
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin/dashboard') ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </span>
                </Link>

                <Link
                  to="/admin/food"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin/food') ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <UtensilsCrossed className="w-4 h-4" /> Food Management
                  </span>
                </Link>

                <Link
                  to="/admin/combos"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin/combos') ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-1.5"><Tags className="w-4 h-4" /> Combos</span>
                </Link>

                <Link
                  to="/admin/orders"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin/orders') ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Orders Queue
                  </span>
                </Link>

                <Link
                  to="/admin/slots"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin/slots') ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4" /> Pickup Slots
                  </span>
                </Link>

                <Link
                  to="/admin/reports"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin/reports') ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4" /> Sales Reports
                  </span>
                </Link>

                <Link
                  to="/admin/feedback"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/admin/feedback') ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> Feedback</span>
                </Link>
              </>
            )}
          </div>

          {/* Right Action Icons & User Controls */}
          <div className="hidden md:flex items-center space-x-3 relative">
            {!isAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <Link
                  to="/cart"
                  className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                  title="View Cart"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {totalItemsCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                      {totalItemsCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 pl-3 border-l border-slate-700/60">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-sm text-slate-300 hover:text-white group"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="font-medium text-slate-200 group-hover:text-indigo-400 transition-colors">
                    {user?.name.split(' ')[0]}
                    {user?.role === 'Admin' && (
                      <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-indigo-500/20 text-indigo-300 rounded font-bold uppercase">
                        Admin
                      </span>
                    )}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white gradient-bg rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && !isAdmin && (
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
                className="relative p-2 text-slate-300"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            )}
            {!isAdmin && (
              <Link to="/cart" className="relative p-2 text-slate-300">
                <ShoppingCart className="w-6 h-6" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItemsCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {notificationsOpen && isAuthenticated && !isAdmin && (
          <div className="absolute right-0 top-14 w-80 max-h-96 overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white">Notifications</span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="text-[10px] font-semibold text-indigo-300 hover:text-white flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-xs text-slate-400 text-center">No notifications yet.</div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification._id}
                    type="button"
                    onClick={() => !notification.isRead && markNotificationRead(notification._id)}
                    className={`w-full text-left border-b border-slate-800 px-4 py-3 transition-colors ${notification.isRead ? 'bg-slate-900/50' : 'bg-slate-900/90 hover:bg-slate-800/80'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-xs text-slate-200 leading-relaxed">{notification.message}</span>
                      {!notification.isRead && <span className="w-2 h-2 bg-indigo-400 rounded-full mt-1.5 shrink-0" />}
                    </div>
                    <div className="mt-2 text-[10px] text-slate-400">
                      {notification.orderId ? `Order ${notification.orderId}` : 'Order update'} • {new Date(notification.createdAt).toLocaleString()}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {!isAdmin ? (
            <>
              <Link
                to="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                🍔 Browse Menu
              </Link>
              <Link
                to="/combos"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                <Tags className="w-4 h-4 inline mr-2" /> Combo Offers
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to="/favorites"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
                  >
                    <Heart className="w-4 h-4 inline mr-2" /> Favorites
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
                  >
                    📦 My Orders & Tracking
                  </Link>
                  <Link
                    to="/feedback"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
                  >
                    ⭐ Feedback & Ratings
                  </Link>
                </>
              )}
            </>
          ) : (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                📊 Admin Dashboard
              </Link>
              <Link
                to="/admin/food"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                🍕 Manage Food Menu
              </Link>
              <Link
                to="/admin/combos"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                <Tags className="w-4 h-4 inline mr-2" /> Manage Combos
              </Link>
              <Link
                to="/admin/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                📝 Manage Incoming Orders
              </Link>
              <Link
                to="/admin/slots"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                🕒 Manage Pickup Slots
              </Link>
              <Link
                to="/admin/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                📈 View Sales Reports
              </Link>
              <Link
                to="/admin/feedback"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
              >
                <MessageSquare className="w-4 h-4 inline mr-2" /> Student Feedback
              </Link>
            </>
          )}

          <div className="pt-4 border-t border-slate-800">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-1 text-xs text-slate-400">
                  Signed in as <span className="text-indigo-400 font-semibold">{user?.email}</span>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-slate-800"
                >
                  👤 Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-400 hover:bg-rose-500/10"
                >
                  🚪 Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-slate-200 bg-slate-800 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-white gradient-bg rounded-xl font-semibold"
                >
                  Register Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
