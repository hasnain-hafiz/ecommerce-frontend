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
      </CartProvider>
    </AuthProvider>
  );
}


export default App
