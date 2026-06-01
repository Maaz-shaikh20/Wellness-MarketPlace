import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

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
  
  const [product, setProduct] = useState(state?.item || null);
  const [fetchingProduct, setFetchingProduct] = useState(!state?.item);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");
  const { refreshCart } = useCart();

  const [reviews, setReviews] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [error, setError] = useState("");
  const [cartToast, setCartToast] = useState(""); // "" | "success" | "error"

  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 5);

  useEffect(() => {
    if (!product && urlId) {
      const fetchProduct = async () => {
        try {
          const res = await api.get(`/products/${urlId}`);
          setProduct(res.data);
        } catch (err) {
          console.error("Failed to fetch product:", err);
        } finally {
          setFetchingProduct(false);
        }
      };
      fetchProduct();
    }
  }, [product, urlId]);

  if (fetchingProduct) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white font-mono">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="tracking-widest uppercase text-xs font-bold text-slate-500">
          Loading Product details...
        </span>
      </div>
    );
  }

  // If page is refreshed and state is lost and fetch fails
  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500 font-bold">Product data not found.</p>
        <button
          onClick={() => navigate("/products")}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow hover:bg-slate-800 transition"
        >
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
    if (!product) return;
    const fetchReviews = async () => {
      try {
        const res = await api.get(
          `/product-reviews/product/${product.id || urlId}`
        );
        setReviews(res.data || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [product?.id, urlId]);

  /* -------- 1. ADD TO CART (API Call) -------- */
  const handleAddToCart = async () => {
    if (!token || !user.id) {
      alert("Please login to add items to cart");
      navigate("/login");
      return;
    }

    try {
      const response = await api.post(
        `/cart/add?userId=${user.id}`,
        { 
          productId: product.id, 
          quantity: 1 
        }
      );

      if (response.status === 200 || response.data === "Product added to cart") {
        setCartToast("success");
        refreshCart(); // ✅ Update navbar badge immediately
        setTimeout(() => setCartToast(""), 3000);
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
      setCartToast("error");
      setTimeout(() => setCartToast(""), 3000);
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
      await api.post(
        "/product-reviews",
        {
          productId: product.id,
          userId: user.id,
          review: newReview,
          rating: newRating,
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
      <Navbar user={user?.id ? user : null} />

      {/* CART TOAST NOTIFICATION */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] transition-all duration-500 ${
          cartToast
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {cartToast === "success" && (
          <div className="flex items-center gap-3 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Added to cart! View your cart in the navbar.
          </div>
        )}
        {cartToast === "error" && (
          <div className="flex items-center gap-3 bg-rose-600 text-white px-6 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Failed to add to cart. Please try again.
          </div>
        )}
      </div>

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