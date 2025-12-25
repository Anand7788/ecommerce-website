import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import Footer from "./components/Footer";
import ScrollToTop from './components/ScrollToTop';

// Admin Imports
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminLogin from './pages/AdminLogin';
import AdminOrders from './pages/AdminOrders';
import AdminOrderDetails from './pages/AdminOrderDetails';
import AdminCustomers from './pages/AdminCustomers';
import AdminCustomerDetails from './pages/AdminCustomerDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ChangePassword from './pages/ChangePassword';
import UserProfile from './pages/UserProfile';
import LoginSecurity from './pages/LoginSecurity';
import Addresses from './pages/Addresses';

const PublicLayout = () => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default function App(){
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
         <Route index element={<AdminDashboard />} />
         <Route path="products" element={<AdminProducts />} />
         <Route path="orders" element={<AdminOrders />} />
         <Route path="orders/:id" element={<AdminOrderDetails />} />
         <Route path="customers" element={<AdminCustomers />} />
         <Route path="customers/:id" element={<AdminCustomerDetails />} />
         {/* Fallback for other admin links */}
         <Route path="*" element={<div style={{padding:20}}>Coming Soon</div>} />
      </Route>

      {/* Public Routes */}
      <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/login-security" element={<LoginSecurity />} />
      <Route path="/addresses" element={<Addresses />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      </Route>
    </Routes>
    </>
  );
}
