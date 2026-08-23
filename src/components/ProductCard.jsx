import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
const API = import.meta.env.VITE_API_BASE_URL;
// change when deployed

export default function ProductCard({
    product,
    isSellerView = false,
    onEdit,
    onDelete
}) {

    const navigate = useNavigate();

    const { addToCart } = useContext(CartContext);

    const { token, seller } = useContext(AuthContext);

    return (

        <div className="product-card">

            <div
                onClick={() => navigate(`/product/${product.id}`)}
            >

                <img
                    src={`${API}${product.imageList?.[0]?.fileUrl}`}
                    alt={product.name}
                    className="product-img"
                />

                <div className="product-info">

                    <h3>{product.name}</h3>

                    <p>{product.description}</p>

                    <div>₹{product.price}</div>

                    {seller && (
                        <p>stock: {product.inventory}</p>
                    )}

                </div>

            </div>

            {/* BUYER BUTTON */}
            {!seller && (

                <button
                    className="product-btn"
                    onClick={() => {

                        if (!token) {
                            navigate("/auth");
                            return;
                        }

                        addToCart(product.id);
                    }}
                >
                    Add to Cart
                </button>
            )}

            {/* SELLER BUTTONS */}
            {isSellerView && (

                <div className="seller-actions">

                    <button
                        onClick={onEdit}
                    >
                        Edit
                    </button>

                    <button
                        onClick={onDelete}
                    >
                        Delete
                    </button>

                </div>
            )}

        </div>
    );
}