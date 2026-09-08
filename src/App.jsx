import { useState } from 'react'

import { AuthProvider } from './context/AuthContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Authentication from './pages/Authentication';
import { useEffect } from 'react';
import './App.css'
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
// NEW (Phase 3): password reset flow.
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import GuestRoute from './routes/GuestRoute';
import PrivateRoute from './routes/PrivateRoute';
import SellerRoute from './routes/SellerRoute';
import SellerDashboard from './pages/SellerDashboard';
import EditProduct from './pages/EditProduct';



function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <Routes>

              {/* Public */}
              <Route element={<GuestRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Authentication />} />
              </Route>

              <Route path="/product/:id" element={<ProductDetails />} />

              {/* NEW (Phase 3): not gated by GuestRoute -- a logged-in
                  user should still be able to reset their password (e.g.
                  if they suspect their account is compromised). */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Authenticated */}
              <Route element={<PrivateRoute />}>
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order/:id" element={<OrderDetails />} />
              </Route>

              {/* Seller */}
              <Route element={<SellerRoute />}>
                <Route path="/seller" element={<SellerDashboard />} />
                <Route path="/seller/edit/:id" element={<EditProduct />} />
              </Route>

            </Routes>

            <ToastContainer
              position="top-right"
              autoClose={2000}
            />
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}


export default App
