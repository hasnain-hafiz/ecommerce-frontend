import { createContext, useContext, useEffect, useState } from "react";
import { privateApi, publicApi } from "../api/axios";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { token } = useContext(AuthContext);

    const [cart, setCart] = useState({});
    const [loading, setLoading] = useState(false);

    // ✅ Fetch Cart
    const fetchCart = async () => {
        if (!token) return;

        setLoading(true);
        try {
            const res = await privateApi.get("/cart/my");
            setCart(res.data.data);
           
        } catch (err) {
            console.log(err);

        } finally {
            setLoading(false);
        }
    };

 
    // ✅ Add Item
    const addToCart = async (productId) => {
        try {
            const res = await privateApi.post(`/cart/items/${productId}`);
        
            setCart(res.data.data);
            toast.success("Added to cart");
        } catch (err) {
            toast.error(err.response?.data?.data || "Failed to add");
        }
    };

    // ✅ Update Quantity
    const updateQuantity = async (productId, quantity) => {
        try {
            const res = await privateApi.put(`/cart/items/${productId}?quantity=${quantity}`);
            setCart(res.data.data);
        } catch (err) {
            console.log(err)
            toast.error("Failed to update quantity");
        }
    };

    // ✅ Remove Item
    const removeFromCart = async (productId) => {
        try {
            const res = await privateApi.delete(`/cart/items/${productId}`);
            console.log(res);
            setCart(res.data.data);
        } catch (err) {
            console.log(err);
            toast.error("Failed to remove item");
        }
    };

    // ✅ Clear Cart
    const clearCart = async () => {
        try {
            await privateApi.delete("/cart/clear");
            setCart(null);
        } catch (err) {
            toast.error("Failed to clear cart");
        }
    };

    useEffect(() => {
        fetchCart();
    }, [token]);



    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                fetchCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

// custom hook (clean usage)
export const useCart = () => useContext(CartContext);