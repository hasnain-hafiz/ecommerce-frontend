import React, { useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Authentication from "./Authentication";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function Home() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();


    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get("/product/all");
            setProducts(res.data.data);
            console.log(res);
        }

        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

   if (loading) {
        return (
            <div className="products-loading">
                Loading products...
            </div>
        );
    }

    return (
        <div className="home-page">
            <div className="top-bar">
                <h2>My E-Commerce</h2>
                <div className="search-box">
                    <input type="text" placeholder="Search Products" />
                    <button>Search</button>
                </div>
                <button onClick={() => navigate(token ? "/cart" : "/auth")}>
                    {token ? "My Cart" : "Login"}
                </button>
                {token ? (
                    <button onClick={()=> navigate("/orders")}>My Orders</button>
                ) : null}
            </div>

            <div className="product-list">
                <h2>products</h2>
                <div className="product-container">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    )
                    )}
                </div>
            </div>

        </div>
    )
}