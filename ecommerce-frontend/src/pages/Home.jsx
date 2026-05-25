import React, { useContext, useEffect, useState } from "react";
import { publicApi } from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Authentication from "./Authentication";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function Home() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const { logout } = useContext(AuthContext);
    const { token } = useContext(AuthContext);
    const { seller } = useContext(AuthContext);
    const { sellerOut } = useContext(AuthContext);
    const navigate = useNavigate();


    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await publicApi.get("/product/all");
            setProducts(res.data.data);
            console.log(res);
        }

        finally {
            setLoading(false);
        }
    };

    const searchProducts = async () => {
        if (!search.trim()) return fetchNotes();
        const res = await publicApi.get(`/product/search?keyword=${search}`);
        setProducts(res.data.data);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") searchProducts();
    };

     useEffect(() => {
           
            const toastId = toast.loading("Server is spinning up...");
            const warmUp = async () => {
                
                try {
                    const response = await publicApi.get("/auth/warmup");
                    if (response.status === 200) {
                        toast.update(toastId, {
                            render: "Server is Online 🎉",
                            type: "success",
                            isLoading: false,
                            autoClose: 3000,
                        });
                    }
                } catch (err) {
                    console.error("Warmup failed:", err);
                    toast.update(toastId, {
                        render: "Something went wrong",
                        type: "error",
                        isLoading: false,
                        autoClose: 3000,
                    });
                }
            };
            warmUp();
        }, []);

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

                    <span className="search-icon">⌕</span>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {search && (
                        <button className="search-clear" onClick={() => { setSearch(""); fetchProducts(); }}>
                            ✕
                        </button>
                    )}
                    <button className="search-btn" onClick={searchProducts}>Search</button>
                </div>

                <button onClick={() => navigate(token ? "/cart" : "/auth")}>
                    {token ? "My Cart" : "Login"}
                </button>

                {token ? (
                    <button onClick={() => navigate("/orders")}>My Orders</button>
                ) : null}
                {token && (
                    <button className="logout-btn" onClick={logout} title="Sign out">
                        ⎋ Sign out
                    </button>
                )}
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