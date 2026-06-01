import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, isHistory = false }) {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // "success" | "error"
  const { refreshCart } = useCart();

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
    "https://placehold.co/150x150?text=🌿";

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  const triggerToast = async (msg, type = "GENERAL", kind = "success") => {
    setToastMessage(msg);
    setToastType(kind);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await api.post(
        "/notifications",
        {
          userId,
          type,
          message: `${msg}: ${name}`,
          status: "UNREAD",
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
    await api.post(
      `/cart/add?userId=${userId}`,
      { productId: id, quantity: 1 }
    );
    refreshCart(); // ✅ update navbar badge
    triggerToast("Added to cart!", "CART", "success");
  } catch (error) {
    console.error("Add to cart failed:", error);
    triggerToast("Failed to add to cart", "ERROR", "error");
  }
};


  return (
    <div
      onClick={handleViewDetail}
      className="group relative bg-white rounded-2xl p-6 shadow-xl flex flex-col cursor-pointer hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-emerald-100"
    >
      {showToast && (
        <div className={`absolute z-20 top-3 inset-x-3 flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold shadow-lg transition-all ${
          toastType === "success" ? "bg-slate-900 text-white" : "bg-rose-600 text-white"
        }`}>
          {toastType === "success" ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {toastMessage}
        </div>
      )}

      {/* IMAGE */}
      <div className="text-center mb-4">
        <div className="w-20 h-20 mx-auto rounded-xl overflow-hidden bg-slate-100">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            onError={(e) => { e.target.src = "https://placehold.co/150x150?text=🌿"; }}
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
            className="flex-1 py-2 rounded-xl border-2 border-slate-200 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:border-slate-400 transition-colors"
          >
            Add to Cart
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
