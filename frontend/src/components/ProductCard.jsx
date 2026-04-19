import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductCard({ product, isHistory = false }) {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // DATA NORMALIZATION
  const d = product?.item || product?.product || product;
  const id = d?._id || d?.id;
  const name = d?._name || d?.name || "Product";
  const price = d?._price || d?.price || 0;
  const category = d?._category || d?.category || "Wellness";
  const description = d?._description || d?.description || "No description";

  // IMAGE HANDLING (SAFE)
  const image =
    d?.image ||
    d?.imageUrl ||
    d?.img ||
    d?.thumbnail ||
    "https://via.placeholder.com/150?text=Wellness";

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const triggerToast = async (msg, type = "GENERAL") => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        "http://localhost:8080/api/notifications",
        {
          userId,
          type,
          message: `${msg}: ${name}`,
          status: "UNREAD",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Notification failed", err);
    }
  };

  const handleViewDetail = () => {
    if (id) {
      navigate(`/product/${id}`, { state: { item: d } });
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    navigate("/checkout", { state: { product: d } });
  };

const handleAddToCart = async (e) => {
  e.stopPropagation();

  const token = localStorage.getItem("token");
  if (!token || !userId) {
    navigate("/login");
    return;
  }

  try {
    await axios.post(
      `http://localhost:8080/api/cart/add?userId=${userId}`,
      {
        productId: id,
        quantity: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    triggerToast("Added to Cart", "CART");
  } catch (error) {
    console.error("Add to cart failed:", error);
    triggerToast("Failed to add to cart", "ERROR");
  }
};


  return (
    <div
      onClick={handleViewDetail}
      className="group relative bg-white rounded-2xl p-6 shadow-xl flex flex-col cursor-pointer hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-emerald-100"
    >
      {showToast && (
        <div className="absolute z-20 top-4 inset-x-4 bg-black text-white p-3 rounded-xl text-xs animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* IMAGE (REPLACED INITIAL LETTER) */}
      <div className="text-center mb-4">
        <div className="w-20 h-20 mx-auto rounded-xl overflow-hidden bg-gray-100">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/150?text=Wellness";
            }}
          />
        </div>

        <h3 className="mt-3 font-black text-lg group-hover:text-emerald-600 transition-colors">
          {name}
        </h3>
        <p className="text-xs text-gray-500">{category}</p>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {description}
      </p>

      <div className="mt-auto">
        <div className="flex justify-between mb-4">
          <span className="text-sm font-bold">₹{price}</span>
          <span className="text-xs text-emerald-500 font-bold uppercase tracking-tighter">
            In Stock
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2 rounded-xl border-2 border-gray-100 font-bold text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-colors"
          >
            + Cart
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-[1.5] py-2 rounded-xl bg-[#1B3C53] text-white font-bold text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
