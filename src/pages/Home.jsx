import React, { useContext, useEffect, useState } from "react";
import { publicApi } from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import Authentication from "./Authentication";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";

export default function Home() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [isSearchMode, setIsSearchMode] = useState(false);

    // NEW: pagination state backing the paginated GET /product/all response.
    // Search results (GET /product/search) are still unpaginated this
    // phase, so pagination controls are hidden while isSearchMode is true.
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const { logout } = useContext(AuthContext);
    const { token } = useContext(AuthContext);
    const { seller } = useContext(AuthContext);
    const { sellerOut } = useContext(AuthContext);
    const navigate = useNavigate();


    const fetchProducts = async (pageToLoad = 0) => {
        setLoading(true);
        setIsSearchMode(false);
        try {
            const res = await publicApi.get(`/product/all?page=${pageToLoad}&size=12`);
            const pageData = res.data.data;
            setProducts(pageData.content ?? []);
            setTotalPages(pageData.totalPages ?? 0);
            setPage(pageData.number ?? pageToLoad);
        }
        finally {
            setLoading(false);
        }
    };

    const searchProducts = async () => {
        if (!search.trim()) return fetchProducts(0);
        setLoading(true);
        try {
            const res = await publicApi.get(`/product/search?keyword=${search}`);
            setProducts(res.data.data);
            setIsSearchMode(true);
        } finally {
            setLoading(false);
        }
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
        fetchProducts(0);
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
                        <button className="search-clear" onClick={() => { setSearch(""); fetchProducts(0); }}>
                            ✕
                        </button>
                    )}
                    <button className="search-btn" onClick={searchProducts}>Search</button>
                </div>

                <button onClick={() => navigate(token ? "/cart" : "/auth")}>
                    {token ? "My Cart" : "Login"}
                </button>

                {token ? (
                    <button onClick={() => navigate("/wishlist")}>Wishlist</button>
                ) : null}

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

                {/* NEW: simple pagination controls, hidden during search
                    since /product/search doesn't return page metadata yet. */}
                {!isSearchMode && totalPages > 1 && (
                    <div className="pagination-controls">
                        <button
                            disabled={page <= 0}
                            onClick={() => fetchProducts(page - 1)}
                        >
                            ‹ Prev
                        </button>
                        <span>Page {page + 1} of {totalPages}</span>
                        <button
                            disabled={page >= totalPages - 1}
                            onClick={() => fetchProducts(page + 1)}
                        >
                            Next ›
                        </button>
                    </div>
                )}
            </div>

        </div>
    )
}
