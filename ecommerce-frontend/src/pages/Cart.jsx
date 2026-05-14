import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_BASE_URL;

export default function Cart() {
    const {
        cart,
        loading,
        updateQuantity,
        removeFromCart,
        clearCart
    } = useCart();

    const navigate = useNavigate();

    const placeOrder= async ()=>{
        try{
            console.log("here")
            const res = await api.post("/order/placeOrder");
            console.log("here 2")
            toast.success("order placed successfully");
            const order = res.data.data;
            
            navigate(`/order/${order.id}`);
        }
        catch(err){
            toast.error("failed to place order");
            console.log("error is this "+ err);
        }
    }

    if (loading) {
        return (
            <div className="cart-loading">
                Loading cart...
            </div>
        );
    }

    // console.log("here")
    // if (!cart || !cart.items || cart.items.length === 0) {
    //     console.log("now here")
    //     return (
    //         <div className="empty-cart">
    //             <h2>Your Cart is Empty</h2>
    //             <button onClick={() => navigate("/")}>
    //                 Continue Shopping
    //             </button>
    //         </div>
    //     );
    // }

    return (
        <div className="cart-page">

            <div className="cart-left">

                <h2 className="cart-title">
                    Shopping Cart
                </h2>
                {console.log(cart)}

                {
                    cart?.items?.map((item) => (
                        <div
                            className="cart-item"
                            key={item.id}
                        >    

                            <div className="cart-info">

                                <h3>{item.productName}</h3>

                                <p className="cart-price">
                                   Unit Price: ₹{item.unitPrice}
                                </p>

                                <div className="quantity-box">

                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.productId,
                                                item.quantity - 1
                                            )
                                        }
                                    >
                                        -
                                    </button>

                                    <span>{item.quantity}</span>

                                    <button
                                        onClick={() =>
                                            updateQuantity(
                                                item.productId,
                                                item.quantity + 1
                                            )
                                        }
                                    >
                                        +
                                    </button>

                                </div>

                                <button
                                    className="remove-btn"
                                    onClick={() =>
                                        removeFromCart(item.productId)
                                    }
                                >
                                    Remove
                                </button>

                            </div>

                            <div className="item-total">
                               Total Price: ₹{item.totalPrice}
                            </div>

                        </div>
                    ))
                }

            </div>

            <div className="cart-right">

                <h3>Order Summary</h3>

                <div className="summary-row">
                    <span>Total Items</span>
                    <span>{cart?.items?.length}</span>
                </div>

                <div className="summary-row total-row">
                    <span>Total</span>
                    <span>₹{cart?.totalAmount}</span>
                </div>

                <button className="checkout-btn"
                onClick={placeOrder}
                >
                    Proceed to Checkout
                </button>

                <button
                    className="clear-btn"
                    onClick={clearCart}
                >
                    Clear Cart
                </button>

            </div>

        </div>
    );
}