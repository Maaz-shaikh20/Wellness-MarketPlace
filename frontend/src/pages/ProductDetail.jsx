import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

/* -------- time formatter -------- */
const timeAgo = (timestamp) => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

/* -------- text truncation -------- */
const getPreview = (text, expanded) => {
  const words = text.split(" ");
  if (words.length <= 5 || expanded) return text;
  return words.slice(0, 5).join(" ") + "...";
};

export default function ProductDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id: urlId } = useParams(); // URL ID as backup
  
  // Use state if available, otherwise we could fetch (handled in useEffect if needed)
  const product = state?.item;

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [reviews, setReviews] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [error, setError] = useState("");

  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 5);

  // If page is refreshed and state is lost
  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p>Product data not found.</p>
        <button onClick={() => navigate("/products")} className="text-blue-500 underline">
          Return to Products
        </button>
      </div>
    );
  }

  const rating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 4.4;

  /* -------- fetch reviews -------- */
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/product-reviews/product/${product.id || urlId}`
        );
        setReviews(res.data || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [product.id, urlId]);

  /* -------- 1. ADD TO CART (API Call) -------- */
  const handleAddToCart = async () => {
    if (!token || !user.id) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      // Calling your specific API: http://localhost:8080/api/cart/add?userId=XX
      const response = await axios.post(
        `http://localhost:8080/api/cart/add?userId=${user.id}`,
        { 
          productId: product.id, 
          quantity: 1 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.data === "Product added to cart") {
        alert("Product added to cart!");
        // Optional: navigate("/activity"); 
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add product to cart");
    }
  };

  /* -------- 2. BUY NOW (Navigation) -------- */
  const handleBuyNow = () => {
    if (!token) {
      navigate("/login");
      return;
    }
    // Navigating to /checkout as requested
    navigate("/checkout", { state: { product: product } });
  };

  /* -------- submit review -------- */
  const handleSubmitReview = async () => {
    if (!token) {
      setError("Please login to submit review.");
      navigate("/login");
      return;
    }

    if (!newReview || !newRating) {
      setError("Please add rating and review.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/product-reviews",
        {
          productId: product.id,
          userId: user.id,
          review: newReview,
          rating: newRating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setReviews([
        {
          userName: user.name || "You",
          review: newReview,
          rating: newRating,
          createdAt: new Date().toISOString(),
        },
        ...reviews,
      ]);

      setNewReview("");
      setNewRating(0);
      setError("");
      setShowReviewForm(false);
    } catch (err) {
      console.error("Failed to post review:", err);
      setError("Failed to submit review.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="pt-32 pb-20 max-w-7xl mx-auto px-6">
        <button onClick={() => navigate(-1)} className="mb-10 text-sm text-slate-400">
          ← Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* LEFT: IMAGE & PRICE */}
          <div>
            <div className="max-w-sm aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden mb-4 border shadow-sm">
              <img
                src={product.imageUrl || "/placeholder.png"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex justify-between max-w-sm mb-2">
              <div>
                <p className="text-xs uppercase text-slate-400 font-bold">Price</p>
                <p className="text-xl font-bold">₹{product.price}</p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase text-slate-400 font-bold">Availability</p>
                <p className="font-bold text-emerald-600">In Stock</p>
              </div>
            </div>

            <p className="text-sm text-slate-500">
              ★ {rating} · {reviews.length} reviews
            </p>
          </div>

          {/* RIGHT: INFO & ACTIONS */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-slate-500 mb-4 max-w-xl">{product.description}</p>

            <div className="flex items-center gap-4 mb-6">
              <span className="px-4 py-1 rounded-full text-xs font-bold uppercase bg-slate-100">
                {product.category}
              </span>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-sm font-bold underline underline-offset-4"
              >
                Write Review
              </button>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mb-6 max-w-xl">
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                className="px-6 py-3 rounded-xl border-2 border-slate-900 font-bold hover:bg-slate-50 transition-colors"
                title="Add to Cart"
              >
                +
              </button>
            </div>

            {/* REVIEW FORM */}
            {showReviewForm && (
              <div className="border rounded-2xl p-4 max-w-xl mb-8 bg-slate-50">
                <div className="flex gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => setNewRating(s)}
                      className={`text-xl ${
                        s <= newRating ? "text-amber-500" : "text-slate-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  className="w-full h-24 border rounded-xl p-3 mb-2 bg-white"
                  placeholder="Share your experience..."
                />

                {error && <p className="text-sm text-rose-500 mb-2">{error}</p>}

                <div className="flex justify-end gap-2">
                   <button
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm"
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <section className="mt-14 max-w-4xl">
          <h2 className="text-2xl font-bold mb-2">Reviews</h2>
          <p className="text-slate-500 mb-6">
            ★ {rating} based on {reviews.length} customer reviews
          </p>

          {loading ? (
            <p>Loading reviews...</p>
          ) : (
            <div className="space-y-5">
              {visibleReviews.length > 0 ? (
                visibleReviews.map((r, idx) => {
                  const expanded = expandedReviews[idx];
                  return (
                    <div key={idx} className="border rounded-2xl p-5">
                      <div className="flex justify-between mb-1">
                        <p className="font-bold">
                          {r.userName || "Anonymous"}
                          <span className="text-xs text-slate-400 ml-2">
                            · {timeAgo(new Date(r.createdAt).getTime())}
                          </span>
                        </p>
                        <span className="text-amber-500 font-bold">
                          {"★".repeat(r.rating)}
                        </span>
                      </div>

                      <p className="text-slate-500 text-sm mb-1">
                        {getPreview(r.review, expanded)}
                      </p>

                      {r.review.split(" ").length > 5 && (
                        <button
                          onClick={() =>
                            setExpandedReviews({ ...expandedReviews, [idx]: !expanded })
                          }
                          className="text-xs text-slate-400 font-bold"
                        >
                          {expanded ? "Show less" : "See more"}
                        </button>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-400">No reviews yet for this product.</p>
              )}
            </div>
          )}

          {!showAllReviews && reviews.length > 5 && (
            <button
              onClick={() => setShowAllReviews(true)}
              className="mt-4 text-sm font-bold underline underline-offset-4"
            >
              See more reviews
            </button>
          )}
        </section>
      </main>
    </div>
  );
}