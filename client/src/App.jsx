import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Student & Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import CartCheckout from './pages/CartCheckout';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';
import Favorites from './pages/Favorites';
import Combos from './pages/Combos';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminFoodManagement from './pages/AdminFoodManagement';
import AdminComboManagement from './pages/AdminComboManagement';
import AdminOrderManagement from './pages/AdminOrderManagement';
import AdminSlotManagement from './pages/AdminSlotManagement';
import AdminFeedbackManagement from './pages/AdminFeedbackManagement';
import AdminReports from './pages/AdminReports';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/combos" element={<Combos />} />
                <Route path="/feedback" element={<Feedback />} />

                {/* Protected Student Routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <CartCheckout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-success/:id"
                  element={
                    <ProtectedRoute>
                      <OrderSuccess />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrderHistory />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-tracking/:id"
                  element={
                    <ProtectedRoute>
                      <OrderTracking />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/favorites"
                  element={
                    <ProtectedRoute>
                      <Favorites />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/food"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminFoodManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/combos"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminComboManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminOrderManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/slots"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminSlotManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/feedback"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminFeedbackManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminReports />
                    </ProtectedRoute>
                  }
                />

                {/* Catch All Fallback */}
                <Route path="*" element={<Navigate to="/menu" replace />} />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
