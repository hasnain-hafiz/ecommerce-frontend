import { useEffect, useState } from "react";
import { privateApi } from "../api/axios";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SellerProducts() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const fetchProducts = async () => {
        setLoading(true);

        try {
            const res = await privateApi.get("/seller/products");
            setProducts(res.data.data);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (productId) => {

        const confirmDelete = window.confirm(
            "Delete this product?"
        );

        if (!confirmDelete) return;

        try {

            await privateApi.delete(`/seller/delete/${productId}`);

            toast.success("Product deleted");

            setProducts(prev =>
                prev.filter(p => p.id !== productId)
            );

        } catch (err) {

            toast.error(
                err.response?.data?.message || "Delete failed"
            );
        }
    };

    if (loading) {
        return <div className="products-loading">Loading products...</div>;
    }

    return (
        <div className="product-list">

            <h2>My Products</h2>

            <div className="product-container">

                {products.map(product => (

                    <ProductCard
                        key={product.id}
                        product={product}

                        isSellerView={true}

                        onEdit={() =>
                            navigate(`/seller/edit/${product.id}`)
                        }

                        onDelete={() =>
                            handleDelete(product.id)
                        }
                    />

                ))}

            </div>

        </div>
    );
}