import React from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
    const { wishlist, loading } = useWishlist();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="products-loading">
                Loading wishlist...
            </div>
        );
    }

    if (!wishlist.length) {
        return (
            <div className="empty-cart">
                <h2>Your wishlist is empty</h2>
                <button onClick={() => navigate("/")}>
                    Browse Products
                </button>
            </div>
        );
    }

    return (
        <div className="product-list">
            <h2>My Wishlist</h2>
            <div className="product-container">
                {wishlist.map((item) => (
                    <ProductCard key={item.id} product={item.product} />
                ))}
            </div>
        </div>
    );
}
