import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
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

    // NEW (Phase 2b): wishlist toggle, customers only.
    const { isWishlisted, toggleWishlist } = useWishlist();
    const wishlisted = !seller && isWishlisted(product.id);

    return (

        <div className="product-card">

            {!seller && (
                <button
                    className={`wishlist-btn ${wishlisted ? "active" : ""}`}
                    title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!token) {
                            navigate("/auth");
                            return;
                        }
                        toggleWishlist(product.id);
                    }}
                >
                    {wishlisted ? "♥" : "♡"}
                </button>
            )}

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

                    {product.reviewCount > 0 && (
                        <p className="product-rating">
                            ★ {product.averageRating?.toFixed(1)} ({product.reviewCount})
                        </p>
                    )}

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
