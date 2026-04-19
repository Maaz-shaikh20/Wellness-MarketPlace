import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft, Image as ImageIcon, Clock, CreditCard, Activity, Layers } from "lucide-react";

export default function CreateTherapy() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const practitioner = JSON.parse(localStorage.getItem("practitioner"));
    if (!practitioner) return alert("Practitioner not found");
    if (!name || !description || !price || !duration || !category || !imageUrl)
      return alert("Please fill all fields");

    try {
      await api.post("/therapies", {
        practitionerId: practitioner.id,
        name,
        description,
        price: Number(price),
        duration: Number(duration),
        category: category.toUpperCase(),
        imageUrl,
        available: true,
        rating: 0.0,
      });
      alert("Therapy initialized successfully");
      navigate("/practitioner/therapies");
    } catch (err) {
      console.error(err);
      alert("Failed to initialize therapy node");
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-[#1B3C53] font-sans overflow-hidden">
      
      {/* Navbar Back */}
      <div className="max-w-7xl mx-auto px-6 pt-24">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF004D] text-white rounded-full font-bold text-[12px] uppercase hover:bg-[#e60040] shadow-md active:scale-95"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-dashed border-gray-200 pb-12 mb-12 gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-tight italic">
              Initialize <span className="text-[#FF004D]">Node</span>
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              Enter therapy details below to deploy a new therapy session.
            </p>
          </div>
          <div className="flex items-center gap-3 px-6 py-2 bg-[#FFF0F2] rounded-full border border-[#FF004D]/20">
            <Activity className="text-[#FF004D] animate-pulse" size={16} />
            <span className="text-xs font-bold uppercase text-[#FF004D] tracking-widest">New Entry Mode</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Form */}
          <form onSubmit={submit} className="lg:col-span-7 space-y-8">
            
            <div className="space-y-6">
              {/* Name */}
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase text-gray-500 mb-2">Therapy Name</label>
                <input
                  placeholder="THERAPY_NAME"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl p-4 font-bold text-lg placeholder-gray-300 focus:border-[#FF004D] focus:ring-1 focus:ring-[#FF004D] transition-all"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col">
                <label className="text-xs font-bold uppercase text-gray-500 mb-2">Description</label>
                <textarea
                  placeholder="Define therapy parameters and objectives..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-200 rounded-2xl p-4 font-sans placeholder-gray-300 focus:border-[#FF004D] focus:ring-1 focus:ring-[#FF004D] transition-all"
                />
              </div>

              {/* Duration & Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative flex flex-col">
                  <label className="text-xs font-bold uppercase text-gray-500 mb-2">Duration (mins)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      type="number"
                      placeholder="00"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full pl-12 border border-gray-200 rounded-2xl p-3 font-bold focus:border-[#FF004D] focus:ring-1 focus:ring-[#FF004D] transition-all"
                    />
                  </div>
                </div>
                <div className="relative flex flex-col">
                  <label className="text-xs font-bold uppercase text-gray-500 mb-2">Price (INR)</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      type="number"
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full pl-12 border border-gray-200 rounded-2xl p-3 font-bold focus:border-[#FF004D] focus:ring-1 focus:ring-[#FF004D] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Category & Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative flex flex-col">
                  <label className="text-xs font-bold uppercase text-gray-500 mb-2">Category</label>
                  <div className="relative">
                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      placeholder="WELLNESS"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full pl-12 border border-gray-200 rounded-2xl p-3 font-bold focus:border-[#FF004D] focus:ring-1 focus:ring-[#FF004D] transition-all"
                    />
                  </div>
                </div>
                <div className="relative flex flex-col">
                  <label className="text-xs font-bold uppercase text-gray-500 mb-2">Image URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input
                      placeholder="HTTPS://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full pl-12 border border-gray-200 rounded-2xl p-3 font-mono text-sm focus:border-[#FF004D] focus:ring-1 focus:ring-[#FF004D] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full bg-[#FF004D] text-white py-4 rounded-full font-bold uppercase tracking-wide shadow-md hover:shadow-lg hover:bg-[#e60040] transition-all active:scale-95 flex items-center justify-center gap-3">
              <Plus size={18} /> Deploy Therapy Node
            </button>
          </form>

          {/* Live Preview */}
          <aside className="lg:col-span-5 hidden lg:block">
            <div className="sticky top-32 space-y-6">
              <div className="flex items-center gap-3 opacity-40">
                <span className="text-xs font-bold uppercase tracking-widest">Live Preview</span>
                <span className="flex-grow border-t border-dashed border-gray-200" />
              </div>

              <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-lg">
                <div className="relative h-64">
                  {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover grayscale opacity-80" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <ImageIcon size={48} />
                    </div>
                  )}
                  <span className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border border-gray-200">
                    {category || "CATEGORY"}
                  </span>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-2xl font-extrabold uppercase truncate">{name || "NODE_NAME"}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{description || "Awaiting input..."}</p>
                  <div className="flex justify-between pt-4 border-t border-gray-200 text-xs font-bold uppercase">
                    <span>Duration: {duration || "00"}m</span>
                    <span className="text-[#FF004D]">Cost: ₹{price || "0.00"}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
