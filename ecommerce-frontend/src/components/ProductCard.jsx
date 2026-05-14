import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
const API = import.meta.env.VITE_API_BASE_URL;
// change when deployed

export default function ProductCard({ product }) {

    const navigate = useNavigate();
    // const {fetchCart} = useContext(CartContext);
    const { addToCart } = useContext(CartContext);
    const { token } = useContext(AuthContext);


    return (
        <div>
            <div className="product-card">
                <div onClick={() => navigate(`/product/${product.id}`)} >
                    <img
                        src={`${API}${product.imageList?.[0]?.fileUrl}`}
                        alt={product.name}
                        className="product-img"
                    />

                    <div className="product-info">
                        <h3 className="product-title">{product.name}</h3>

                        <p className="product-description">
                            {product.description}
                        </p>

                        <div className="product-price">
                            ₹{product.price}
                        </div>


                    </div>
                </div>
                <button className="product-btn"
                    onClick={() => { if (!token) { navigate("/auth"); return; } addToCart(product.id) }}
                >
                    Add to Cart
                </button>

            </div>

        </div>
    );
}