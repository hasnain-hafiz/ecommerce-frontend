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
// NEW (Phase 2b): wishlist context + page.
import { WishlistProvider } from './context/WishlistContext';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import GuestRoute from './routes/GuestRoute';
import PrivateRoute from './routes/PrivateRoute';
import SellerRoute from './routes/SellerRoute';
import SellerDashboard from './pages/SellerDashboard';
import EditProduct from './pages/EditProduct';



function App() {
  return (
    <AuthProvider>
      <CartProvider>
        {/* NEW (Phase 2b): sits alongside CartProvider — both are
            per-customer, per-session client state built the same way. */}
        <WishlistProvider>
          <BrowserRouter>
            <Routes>

              {/* Public */}
              <Route element={<GuestRoute />}>
                <Route path="/" element={<Home />} />
                <Route path="/auth" element={<Authentication />} />
              </Route>

              <Route path="/product/:id" element={<ProductDetails />} />

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
