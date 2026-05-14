import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
const API = import.meta.env.VITE_API_BASE_URL;


export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/product/${id}`);
      setProduct(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!product) return <h2>Loading...</h2>;

  return (
    <div className="product-details">
      <div className="details-container">

        {/* LEFT - IMAGE */}
        <div className="details-image">
          <img
            src={`${API}${product.imageList?.[0]?.fileUrl}`}
            alt={product.name}
          />
        </div>

        {/* RIGHT - INFO */}
        <div className="details-info">
          <h2>{product.name}</h2>
          <p className="brand">{product.brand}</p>
          <p className="price">₹{product.price}</p>
          <p className="desc">{product.description}</p>

          <button className="add-btn"
            onClick={() => { if (!token) { navigate("/auth"); return; } addToCart(product.id) }}
          >Add to Cart</button>
        </div>

      </div>
    </div>
  );
}