import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { publicApi } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
const API = import.meta.env.VITE_API_BASE_URL;


export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToCart } = useContext(CartContext);
  const { user, isSeller } = useContext(AuthContext);
  const navigate = useNavigate();


  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await publicApi.get(`/product/${id}`);

      const productData = res.data.data;

      if (productData.imageList?.length > 0) {
        setCurrentIndex(0);
      }

      setProduct(productData);

      if (productData.imageList?.length > 0) {
        setSelectedImage(productData.imageList[0].fileUrl);
      }

    } catch (err) {
      console.error(err);
    }
  };

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === product.imageList.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? product.imageList.length - 1 : prev - 1
    );
  };

  if (!product) return <h2 className="products-loading">Loading...</h2>;

  return (
    <div className="product-details">
      <div className="details-container">

        {/* LEFT - IMAGE */}
        <div className="details-image">

          <div className="slider-container">

            <button className="slide-btn left" onClick={prevImage}>
              ❮
            </button>

            <div className="slider-wrapper">

              <div
                className="slider-track"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`
                }}
              >

                {product.imageList?.map((img) => (

                  <img
                    key={img.id}
                    src={`${API}${img.fileUrl}`}
                    alt={product.name}
                    className="main-image"
                  />

                ))}

              </div>

            </div>

            <button className="slide-btn right" onClick={nextImage}>
              ❯
            </button>

          </div>

          {/* <div className="thumbnail-container">

            {product.imageList?.map((img, index) => (

              <img
                key={img.id}
                src={`${API}${img.fileUrl}`}
                alt={product.name}
                className={`thumbnail ${currentIndex === index ? "active" : ""
                  }`}
                onClick={() => setCurrentIndex(index)}
              />

            ))}

          </div> */}

        </div>

        {/* RIGHT - INFO */}
        <div className="details-info">
          <h2>{product.name}</h2>
          <p className="brand">{product.brand}</p>
          <p className="price">₹{product.price}</p>
          <p className="desc">{product.description}</p>
          {isSeller && <p className="product-inventory">stock:{product.inventory}</p>}

          { !isSeller && <button className="add-btn"
            onClick={() => { if (!user) { navigate("/auth"); return; } addToCart(product.id) }}
          >
            Add to Cart
          </button> }
        </div>

      </div>
    </div>
  );
}