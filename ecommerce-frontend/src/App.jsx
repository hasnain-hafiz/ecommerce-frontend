import { useState } from 'react'

import { AuthProvider } from './context/AuthContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from './api/axios';
import Authentication from './pages/Authentication';
import { useEffect } from 'react';
import './App.css'
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import ProtectedRoute from './routes/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';


function App() {


  return (
    <AuthProvider>
      <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/auth" element={<Authentication />} />
          <Route path='/cart' element= 
          {<ProtectedRoute>
            <Cart />
          </ProtectedRoute>}
          />
          <Route path='/orders' element= 
          {<ProtectedRoute>
            <Orders />
          </ProtectedRoute>}
          />
          <Route path='/order/:id' element= 
          {<ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>}
          />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App
