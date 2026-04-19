import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Plus, ArrowLeft, Loader2, Trash2, Edit3 } from "lucide-react";
import api from "../api/axios"; // Use your axios instance

export default function ManageProduct() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch products from backend on mount
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Handle Delete (Optional: Your backend needs a DELETE mapping)
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete product. Check permissions.");
    }
  };

  return (
    <div className="min-h-screen bg-[#EFECE3] text-[#1B3C53]">
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <button
          onClick={() => navigate("/practitioner/home")}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-xs uppercase font-bold mb-12 shadow-lg active:scale-95 transition-transform"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#1B3C53]/10 pb-10 mb-12 gap-6">
          <div>
            <h1 className="text-6xl font-black uppercase italic tracking-tighter">
              Your <span className="text-blue-500">Inventory</span>
            </h1>
            <p className="text-[#1B3C53]/60 font-medium">Manage and monitor your deployed product nodes.</p>
          </div>
          <button
            onClick={() => navigate("/practitioner/products/create")}
            className="flex items-center gap-2 bg-[#1B3C53] text-white px-8 py-4 rounded-2xl uppercase text-xs font-black tracking-widest hover:bg-[#2a5a7c] transition-colors shadow-xl"
          >
            <Plus size={16} /> Add Product
          </button>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
            <p className="font-black uppercase tracking-widest text-[10px]">Syncing_Database</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-40 border-4 border-dashed border-[#1B3C53]/10 rounded-[3rem] text-center bg-white/50">
            <Package size={64} className="mx-auto mb-6 text-[#1B3C53]/20" />
            <p className="uppercase tracking-[0.3em] text-xs font-black text-[#1B3C53]/40">No active products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <div
                key={p.id}
                className="group relative border border-[#1B3C53]/5 rounded-[2.5rem] p-8 bg-white hover:shadow-2xl transition-all duration-500 flex flex-col"
              >
                {/* Product Image Preview */}
                <div className="h-48 w-full bg-[#EFECE3] rounded-[1.5rem] mb-6 overflow-hidden relative">
                    {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-10"><Package size={48}/></div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        ID: {p.id}
                    </div>
                </div>

                <div className="flex-grow">
                  <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">{p.category || "General"}</span>
                  <h3 className="font-black text-2xl mt-1 tracking-tighter uppercase italic">{p.name}</h3>
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2 font-medium">{p.description}</p>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Investment</p>
                    <p className="text-2xl font-black text-[#1B3C53]">₹{p.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock</p>
                    <p className={`font-black ${p.stock < 10 ? 'text-red-500' : 'text-[#1B3C53]'}`}>{p.stock} units</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => navigate(`/practitioner/products/edit/${p.id}`, { state: { item: p } })}
                    className="flex-1 py-4 border-2 border-[#1B3C53] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#1B3C53] hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="px-6 py-4 bg-red-50 text-red-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}