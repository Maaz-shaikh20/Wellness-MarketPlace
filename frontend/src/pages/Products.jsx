import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";

export default function Products() {
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProductsList(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-widest text-slate-400 uppercase">Curating Collection</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-slate-900 selection:text-white">
      <Navbar user={user} />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        {/* Navigation & Header */}
        <div className="mb-20">
          <button 
            onClick={() => navigate("/home")} // ✅ UPDATED NAVIGATION
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-8 text-xs font-black uppercase tracking-widest"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            Back to System
          </button>
          
          <div className="max-w-3xl">
            <h1 className="text-6xl font-black tracking-tighter text-slate-900 mb-6 uppercase italic">
              Mindful_<span className="text-slate-400">Inventory</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">
              A curated selection of wellness tools and essentials designed to integrate seamlessly into your daily healing practice.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        {productsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {productsList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
            <p className="text-slate-400 font-bold uppercase tracking-widest">No inventory nodes found</p>
          </div>
        )}
      </main>
    </div>
  );
}