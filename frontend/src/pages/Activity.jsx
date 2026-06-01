import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

/* ── helpers ── */
const statusColor = (status) => {
  switch (status?.toUpperCase()) {
    case "PAID":      return "bg-emerald-100 text-emerald-700";
    case "CREATED":   return "bg-amber-100  text-amber-700";
    case "CANCELLED": return "bg-rose-100   text-rose-700";
    case "SHIPPED":   return "bg-blue-100   text-blue-700";
    case "DELIVERED": return "bg-teal-100   text-teal-700";
    default:          return "bg-slate-100  text-slate-600";
  }
};

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

export default function Activity() {
  const [cartItems, setCartItems] = useState([]);
  const [orders,    setOrders]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("cart");
  const [user,      setUser]      = useState(null);
  const [updating,  setUpdating]  = useState({}); // cartItemId → true while API in flight
  const navigate = useNavigate();
  const { refreshCart } = useCart();

  /* ── fetch cart + orders together ── */
  useEffect(() => {
    const token      = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) { navigate("/login"); return; }

    const parsed = JSON.parse(storedUser);
    setUser(parsed);

    const fetchAll = async () => {
      try {
        const [cartRes, ordersRes] = await Promise.all([
          api.get(`/cart?userId=${parsed.id}`),
          api.get(`/orders/user/${parsed.id}`),
        ]);
        setCartItems(Array.isArray(cartRes.data) ? cartRes.data : (cartRes.data?.items || []));
        setOrders((Array.isArray(ordersRes.data) ? ordersRes.data : []).slice().reverse());
      } catch (err) {
        if (err.response?.status === 401) { localStorage.clear(); navigate("/login"); }
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [navigate]);

  /* ── cart total ── */
  const cartTotal = cartItems.reduce(
    (sum, i) => sum + Number(i.price) * i.quantity, 0
  );

  /* ── update quantity (+ / -) ── */
  const handleQtyChange = async (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) { handleRemove(item.cartItemId); return; }

    setUpdating((u) => ({ ...u, [item.cartItemId]: true }));
    // optimistic UI
    setCartItems((prev) =>
      prev.map((i) => i.cartItemId === item.cartItemId ? { ...i, quantity: newQty } : i)
    );
    try {
      await api.put(`/cart/update/${item.cartItemId}`, { quantity: newQty });
      refreshCart();
    } catch (err) {
      console.error("Update qty failed:", err);
      // revert on error
      setCartItems((prev) =>
        prev.map((i) => i.cartItemId === item.cartItemId ? { ...i, quantity: item.quantity } : i)
      );
    } finally {
      setUpdating((u) => ({ ...u, [item.cartItemId]: false }));
    }
  };

  /* ── remove item ── */
  const handleRemove = async (cartItemId) => {
    setUpdating((u) => ({ ...u, [cartItemId]: true }));
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId)); // optimistic
    try {
      await api.delete(`/cart/delete/${cartItemId}`);
      refreshCart();
    } catch (err) {
      console.error("Remove failed:", err);
      alert("Failed to remove item. Please try again.");
    } finally {
      setUpdating((u) => ({ ...u, [cartItemId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Loading Activity…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar user={user} onLogout={() => { localStorage.clear(); navigate("/login"); }} />

      <main className="pt-32 pb-28 px-6 max-w-5xl mx-auto">

        {/* ── HEADER ── */}
        <div className="mb-10 space-y-3">
          <button
            onClick={() => navigate("/products")}
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </button>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">
            Your_<span className="text-slate-300">Activity</span>
          </h1>
        </div>

        {/* ── TABS ── */}
        <div className="flex gap-1 mb-10 border-b border-slate-100">
          {[
            { key: "cart",   label: `Cart  (${cartItems.length})` },
            { key: "orders", label: `Order History  (${orders.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-[11px] font-black uppercase tracking-widest rounded-t-xl transition-all ${
                activeTab === tab.key
                  ? "bg-slate-900 text-white"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════ CART TAB ══════════ */}
        {activeTab === "cart" && (
          <>
            {cartItems.length > 0 ? (
              <div className="space-y-4">

                {/* Cart items list */}
                {cartItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-100 rounded-2xl px-6 py-5 bg-white hover:shadow-sm transition-shadow"
                  >
                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-base truncate">{item.productName}</p>
                      <p className="text-sm text-slate-400 mt-0.5">₹{Number(item.price).toLocaleString("en-IN")} each</p>
                    </div>

                    {/* Qty controls */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleQtyChange(item, -1)}
                        disabled={!!updating[item.cartItemId]}
                        className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold text-lg flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 transition"
                        title="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-black text-base">
                        {updating[item.cartItemId] ? "…" : item.quantity}
                      </span>
                      <button
                        onClick={() => handleQtyChange(item, +1)}
                        disabled={!!updating[item.cartItemId]}
                        className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold text-lg flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 transition"
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <p className="font-black text-lg text-slate-900 w-24 text-right shrink-0">
                      ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                    </p>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(item.cartItemId)}
                      disabled={!!updating[item.cartItemId]}
                      className="text-rose-500 hover:text-rose-700 disabled:opacity-40 transition shrink-0"
                      title="Remove item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}

                {/* ── CART SUMMARY + CHECKOUT CTA ── */}
                <div className="mt-8 border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                      {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} · Cart Total
                    </p>
                    <p className="text-4xl font-black text-slate-900">
                      ₹{cartTotal.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/checkout", { state: { fromCart: true } })}
                    className="w-full sm:w-auto px-14 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z" />
                    </svg>
                    Proceed to Checkout
                  </button>
                </div>
              </div>

            ) : (
              <div className="text-center py-36 bg-slate-50 border border-dashed border-slate-200 rounded-[4rem]">
                <div className="text-6xl mb-6 opacity-20 grayscale">🛒</div>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm mb-8">Your cart is empty</p>
                <button
                  onClick={() => navigate("/products")}
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
                >
                  Browse Products
                </button>
              </div>
            )}
          </>
        )}

        {/* ══════════ ORDER HISTORY TAB ══════════ */}
        {activeTab === "orders" && (
          <>
            {orders.length > 0 ? (
              <div className="space-y-5">
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="border border-slate-100 rounded-3xl p-6 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                          Order #{order.orderId}
                        </p>
                        <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${statusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="text-xl font-black text-slate-900">
                          ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm text-slate-600 bg-slate-50 rounded-xl px-4 py-2">
                          <span className="font-semibold">
                            {item.itemType} — ID #{item.itemId} × {item.quantity}
                          </span>
                          <span className="font-bold text-slate-900">
                            ₹{Number(item.totalPrice).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                    </div>

                    {order.deliveryAddress && (
                      <p className="text-xs text-slate-400 mt-2">📦 {order.deliveryAddress}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-36 bg-slate-50 border border-dashed border-slate-200 rounded-[4rem]">
                <div className="text-6xl mb-6 opacity-20 grayscale">📋</div>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm mb-8">No orders placed yet</p>
                <button
                  onClick={() => navigate("/products")}
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}
