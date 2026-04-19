import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";

export default function Activity() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch user info and cart items on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    const fetchCart = async () => {
      try {
        const res = await api.get(`/cart?userId=${parsedUser.id}`);
        const data = Array.isArray(res.data) ? res.data : (res.data.items || []);
        setCartItems(data);
      } catch (err) {
        console.error("API Error fetching cart:", err);
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  // DELETE a cart item (calls backend + updates UI)
  const handleDelete = async (cartItemId) => {
    try {
      console.log("Deleting cart item ID:", cartItemId);

      // Call backend API
      const res = await api.delete(`/cart/delete/${cartItemId}`);
      console.log("Delete response:", res.status);

      // Update UI after deletion
      setCartItems((prevItems) =>
  prevItems.filter(item => item.cartItemId !== cartItemId)
);


      // Optionally, refetch from backend to ensure UI matches DB
      // await fetchCart(); // Uncomment if needed
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete item. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing_Inventory</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-slate-900 selection:text-white">
      <Navbar 
        user={user} 
        onLogout={() => { localStorage.clear(); navigate("/login"); }} 
      />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="mb-20 space-y-6">
          <button 
            onClick={() => navigate("/products")}
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            Continue Exploring
          </button>
          
          <h1 className="text-7xl font-black tracking-tighter text-slate-900 uppercase italic">
            Your_<span className="text-slate-300">Activity</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">
            Review your curated wellness selections. Manage your inventory or proceed to final investment.
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="space-y-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             {cartItems.map((item) => (
  <div
    key={item.cartItemId}
    className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100"
  >
    <h3 className="font-black text-lg mb-1">
      {item.productName}
    </h3>

    <p className="text-sm text-slate-500 mb-3">
      Quantity: {item.quantity}
    </p>

    <div className="flex justify-between items-center">
      <span className="font-bold text-slate-900">
        ₹{item.price}
      </span>

      <button
        onClick={() => handleDelete(item.cartItemId)}
        className="text-xs font-black uppercase tracking-widest text-red-500 hover:underline"
      >
        Remove
      </button>
    </div>
  </div>
))}

            </div>

            <div className="p-12 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-slate-400/20">
              <div className="text-center md:text-left">
                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-2">Checkout Ready</p>
                <h2 className="text-4xl font-black italic">{cartItems.length} Selections <span className="text-slate-500 font-normal">Active</span></h2>
              </div>
              <button 
  onClick={() => navigate("/checkout", { state: { fromCart: true } })}

                className="w-full md:w-auto px-16 py-6 bg-white text-slate-900 rounded-[1.5rem] font-black uppercase tracking-widest text-sm hover:bg-slate-100 transition-all shadow-lg"
              >
                Proceed to Purchase
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-40 bg-slate-50 border border-dashed border-slate-200 rounded-[4rem]">
            <div className="text-6xl mb-6 opacity-20 grayscale">🌿</div>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm mb-8">No activity detected in your node</p>
            <button 
              onClick={() => navigate("/products")}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
            >
              Back to Market
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
