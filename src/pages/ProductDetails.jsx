import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { publicApi, privateApi } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "react-toastify";
const API = import.meta.env.VITE_API_BASE_URL;


export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addToCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  const { seller } = useContext(AuthContext);
  const navigate = useNavigate();

  // NEW (Phase 2b): wishlist toggle.
  const { isWishlisted, toggleWishlist } = useWishlist();

  // NEW (Phase 2b): reviews.
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);


  useEffect(() => {
    fetchProduct();
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await publicApi.get(`/review/product/${id}`);
      setReviews(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await privateApi.post(`/review/${id}`, {
        rating: Number(newRating),
        comment: newComment,
      });
      toast.success("Review submitted");
      setNewComment("");
      fetchReviews();
      fetchProduct(); // refresh average rating shown above
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
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

  const wishlisted = !seller && isWishlisted(product.id);

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

        </div>

        {/* RIGHT - INFO */}
        <div className="details-info">
          <div className="details-title-row">
            <h2>{product.name}</h2>
            {!seller && (
              <button
                className={`wishlist-btn large ${wishlisted ? "active" : ""}`}
                title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                onClick={() => {
                  if (!token) { navigate("/auth"); return; }
                  toggleWishlist(product.id);
                }}
              >
                {wishlisted ? "♥" : "♡"}
              </button>
            )}
          </div>

          <p className="brand">{product.brand}</p>

          {product.reviewCount > 0 && (
            <p className="product-rating">
              ★ {product.averageRating?.toFixed(1)} · {product.reviewCount} review{product.reviewCount === 1 ? "" : "s"}
            </p>
          )}

          <p className="price">₹{product.price}</p>
          <p className="desc">{product.description}</p>
          {seller && <p className="product-inventory">stock:{product.inventory}</p>}

          { !seller && <button className="add-btn"
            onClick={() => { if (!token) { navigate("/auth"); return; } addToCart(product.id) }}
          >
            Add to Cart
          </button> }
        </div>

      </div>

      {/* NEW (Phase 2b): Reviews section */}
      <div className="reviews-section">
        <h3>Reviews</h3>

        {!seller && token && (
          <form className="review-form" onSubmit={submitReview}>
            <select value={newRating} onChange={(e) => setNewRating(e.target.value)}>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n} star{n === 1 ? "" : "s"}</option>
              ))}
            </select>
            <textarea
              placeholder="Share your thoughts about this product (optional)"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button disabled={submittingReview}>
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
            <p className="review-form-note">
              Only customers who've purchased this product can review it.
            </p>
          </form>
        )}

        {reviewsLoading ? (
          <p className="reviews-loading">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="reviews-empty">No reviews yet.</p>
        ) : (
          <div className="review-list">
            {reviews.map((review) => (
              <div className="review-card" key={review.id}>
                <div className="review-header">
                  <span className="review-stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
                  <span className="review-author">{review.reviewerName}</span>
                </div>
                {review.comment && <p className="review-comment">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
